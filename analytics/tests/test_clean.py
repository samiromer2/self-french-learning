import unittest

from analytics.clean import _collapse_category, normalize_geo
from analytics.validate import VALID_GEOS, validate_long
import pandas as pd


class CleanTests(unittest.TestCase):
    def test_province_aliases(self):
        self.assertEqual(normalize_geo("Quebec [24]"), "Quebec")
        self.assertEqual(normalize_geo("Canada outside Quebec"), "Canada outside Quebec")
        self.assertIsNone(normalize_geo("Montréal, Quebec"))

    def test_category_map(self):
        self.assertEqual(_collapse_category("English and French"), "english_and_french")
        self.assertEqual(_collapse_category("French only"), "french_only")
        self.assertEqual(_collapse_category("Total - Knowledge of official languages"), "total")

    def test_quality_flags_bad_geo(self):
        df = pd.DataFrame(
            {
                "theme": ["knowledge"],
                "year": [2021],
                "geo_code": ["XX"],
                "geo_name": ["Mars"],
                "measure": ["percent"],
                "value": [12.0],
            }
        )
        report = validate_long(df, [{"required": True, "ok": True}])
        self.assertGreater(report["unknown_geo_rows"], 0)
        self.assertTrue(any("unknown geo" in i for i in report["issues"]))


if __name__ == "__main__":
    unittest.main()
