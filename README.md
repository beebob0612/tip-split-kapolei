# Tip Calculator — Kickin' Kajun (Kapolei)

Standalone tip payout calculator, replacing the shared Google Sheet.

## Logic
- CD/SC Fee = (Service Charge + Credit Card Tip) x 5%
- Pool = Service Charge + Credit Card Tip - CD/SC Fee + Cash Tip
- Server (each) = Pool x 75% / server count
- Remaining 25% of the pool splits three ways: hosts, cooks, house fee
  - one third-share = (Pool x 25%) / 3
  - Host (each) = third-share / host count (falls back to the full third-share when host count is 0)
  - Cook (each) = third-share / cook count
  - Fee = third-share

Amounts keep cents (no rounding to whole dollars).

## Dev
```
npm install
npm run dev
```

## Deploy
Push to GitHub, then import into Vercel (framework: Vite). No env vars or backend needed.
