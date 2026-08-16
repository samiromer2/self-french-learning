"""Download official Statistics Canada table ZIPs into data/raw/."""

from __future__ import annotations

import io
import json
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from .config import DATA_PROCESSED, DATA_RAW, STATCAN_ZIP, TABLES, USER_AGENT, WDS_DOWNLOAD


def _request(url: str, timeout: int = 120) -> bytes:
    req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
    with urlopen(req, timeout=timeout) as resp:
        return resp.read()


def _extract_data_csv(zip_bytes: bytes, dest_dir: Path, zip_id: str) -> Path:
    dest_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        names = zf.namelist()
        data_name = None
        for name in names:
            lower = name.lower()
            if lower.endswith("_metadata.csv") or "metadata" in lower:
                meta_path = dest_dir / f"{zip_id}_MetaData.csv"
                meta_path.write_bytes(zf.read(name))
                continue
            if lower.endswith(".csv") and zip_id in Path(name).name.replace("-", ""):
                data_name = name
                break
        if data_name is None:
            csvs = [n for n in names if n.lower().endswith(".csv") and "meta" not in n.lower()]
            if not csvs:
                raise FileNotFoundError(f"No CSV in ZIP for {zip_id}; contents={names}")
            data_name = csvs[0]
        out = dest_dir / f"{zip_id}.csv"
        out.write_bytes(zf.read(data_name))
        return out


def download_table(table: dict) -> dict:
    """Return a provenance record. Raises only if the table is required."""
    zip_id = table["zip_id"]
    dest_dir = DATA_RAW / zip_id
    work_extract = DATA_PROCESSED / "work_province_extract.csv"
    if table["key"] == "language_at_work" and work_extract.exists():
        print(f"  using processed work extract (skipping {zip_id} cube)")
        return {
            "key": table["key"],
            "table": table["table"],
            "title": table["title"],
            "source_url": table["url"],
            "required": table["required"],
            "ok": True,
            "path": str(work_extract),
            "bytes": work_extract.stat().st_size,
            "error": None,
            "downloaded_at": None,
            "method": "processed_extract",
        }
    cached = dest_dir / f"{zip_id}.csv"
    if cached.exists() and cached.stat().st_size > 0:
        print(f"  cached {table['table']} → {cached} ({cached.stat().st_size:,} bytes)")
        return {
            "key": table["key"],
            "table": table["table"],
            "title": table["title"],
            "source_url": table["url"],
            "required": table["required"],
            "ok": True,
            "path": str(cached),
            "bytes": cached.stat().st_size,
            "error": None,
            "downloaded_at": None,
            "method": "cached",
        }
    record = {
        "key": table["key"],
        "table": table["table"],
        "title": table["title"],
        "source_url": table["url"],
        "required": table["required"],
        "ok": False,
        "path": None,
        "bytes": 0,
        "error": None,
        "downloaded_at": datetime.now(timezone.utc).isoformat(),
        "method": None,
    }
    urls = [
        ("static_zip", STATCAN_ZIP.format(table_id=zip_id)),
    ]
    try:
        wds = json.loads(_request(WDS_DOWNLOAD.format(product_id=table["wds_id"]), timeout=60))
        if isinstance(wds, str) and wds.startswith("http"):
            urls.append(("wds", wds))
        elif isinstance(wds, dict):
            for key in ("object", "url", "URI"):
                if isinstance(wds.get(key), str) and wds[key].startswith("http"):
                    urls.append(("wds", wds[key]))
                    break
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError, ValueError):
        pass

    last_error = None
    for method, url in urls:
        try:
            payload = _request(url, timeout=180)
            path = _extract_data_csv(payload, dest_dir, zip_id)
            record.update(
                {
                    "ok": True,
                    "path": str(path),
                    "bytes": path.stat().st_size,
                    "method": method,
                    "download_url": url,
                }
            )
            print(f"  downloaded {table['table']} via {method} → {path} ({path.stat().st_size:,} bytes)")
            return record
        except Exception as exc:  # noqa: BLE001 — ingest must continue for optional tables
            last_error = f"{method}: {exc}"
            print(f"  failed {table['table']} via {method}: {exc}")

    record["error"] = last_error
    if table["required"]:
        raise RuntimeError(f"Required table {table['table']} could not be downloaded: {last_error}")
    print(f"  skipped optional table {table['table']}: {last_error}")
    return record


def ingest_all() -> list[dict]:
    DATA_RAW.mkdir(parents=True, exist_ok=True)
    records = []
    for table in TABLES:
        print(f"Ingesting {table['table']} — {table['title']}")
        records.append(download_table(table))
    return records
