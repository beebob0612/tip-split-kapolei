# Tip Calculator — Kickin' Kajun (Kapolei)

Standalone tip payout calculator, replacing the shared Google Sheet.

## Logic
- CD/SC Fee = (Service Charge + Credit Card Tip) x 5%
- Distributable pool = Service Charge + Credit Card Tip - CD/SC Fee + Cash Tip
- Shares = server count + host count + 2 (one share for all cooks combined, one house fee share)
- One share = pool / shares
- Server (each) = one share
- Host (each) = one share
- Cook (each) = one share / cook count
- Fee = one share

Amounts keep cents (no rounding to whole dollars).

## Dev
```
npm install
npm run dev
```

## Deploy
Push to GitHub, then import into Vercel (framework: Vite). No env vars or backend needed.
