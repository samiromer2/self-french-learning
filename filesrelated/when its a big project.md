# When it's a big project (a.k.a. the "extra cash" list)

This is a fun, free project. Nothing here is needed right now — these are the
upgrades worth doing only if it ever gets real users or a budget.

## Costs actual money

- **AI features (Phase 9)** — grammar feedback on writing, pronunciation
  scoring, conversation practice bot. Needs an Anthropic API key + billing.
  The exercise player already has hooks where this plugs in (writing prompts
  show a "AI feedback arrives in Phase 9" note).
- **Supabase Pro (~$25/mo)** — bigger database (8GB vs 500MB), no built-in
  email rate limits, daily backups. Free tier also pauses projects after ~1
  week of inactivity — Pro doesn't.
- **Custom SMTP + re-enable email confirmation** — signup currently skips
  confirmation emails entirely (admin API creates accounts pre-confirmed).
  Fine for a fun project; a real product wants confirmed emails, which needs
  a proper email provider (Resend/Postmark) wired into Supabase Auth so
  there's no rate limit.
- **Custom domain** — e.g. something.fr 🇫🇷 instead of .vercel.app.
- **Recorded native-speaker audio** — replace browser TTS with real
  recordings. The `Audio` DB model and `public/audio/` folder already exist
  and are empty, waiting for exactly this. Costs either studio time or a
  paid TTS API (ElevenLabs etc.) for natural voices.
- **Vercel Pro** — only if traffic ever exceeds hobby-tier limits.

## Free but only worth the effort at scale

- **Rate limiting** on the signup API (e.g. Upstash Redis free tier) — the
  signup route uses the Supabase admin API, so a bot could spam account
  creation. Irrelevant while nobody knows the site exists.
- **Legal pages** — Terms of Use + Privacy Policy (draft wording already
  written in `nextplans.md`). Worth adding when strangers actually use it.
- **Stricter input validation** (zod schemas on API routes).
- **Rotate all credentials** — the database password, Supabase secret key,
  and publishable key were all pasted in chat during development. Before
  real users: reset DB password (Supabase → Settings → Database), rotate the
  API keys (Settings → API), update Vercel env vars + local .env.
- **Row Level Security policies** — only needed if the Supabase Data API
  (REST/realtime) ever gets used; Prisma's direct connection bypasses it.
- **Proper monitoring** — Sentry free tier for error tracking instead of
  reading Vercel logs by hand.

## Content dreams

- A2 → C2 curriculum (Phase 10 in task.md — free, just a lot of writing)
- More Real-Life Scenarios beyond the first seven in nextplans.md
- Community features: shared decks, friend leaderboards, streaks with
  notifications (needs a real notification infra → costs money)
