import { useMemo, useState } from "react";

const fmt = (n) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function NumField({ label, value, onChange, prefix, placeholder = "0", grow = false }) {
  return (
    <label className={`block ${grow ? "flex-1 flex flex-col" : ""}`}>
      <span className="block font-display text-[0.875rem] tracking-[0.1em] text-char-400 uppercase mb-0.5 leading-tight">
        {label}
      </span>
      <div
        className={`relative flex items-center bg-sand/40 border border-char-200 rounded-lg focus-within:border-rust-500 focus-within:bg-white transition-colors ${
          grow ? "flex-1" : ""
        }`}
      >
        {prefix && (
          <span className="absolute left-3 font-mono text-lg text-char-400 select-none pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent font-mono text-char-950 placeholder:text-char-400/40 outline-none text-center ${
            grow ? "text-2xl py-1" : "text-[1.375rem] py-2.5 px-8"
          }`}
        />
      </div>
    </label>
  );
}

function PayoutRow({ label, count, value, muted = false }) {
  return (
    <div className="flex justify-between items-center bg-white border border-char-200 rounded-lg px-3.5 py-2">
      <span className={`font-mono text-[0.95rem] ${muted ? "text-char-400" : "text-char-950"}`}>
        {label}
        {count > 0 && <span className="text-char-400"> ×{count}</span>}
      </span>
      <span
        className={`font-mono font-semibold leading-none ${
          muted ? "text-[1.15rem] text-char-400" : "text-[1.55rem] text-char-950"
        }`}
      >
        {value === null ? "—" : `$${fmt(value)}`}
      </span>
    </div>
  );
}

export default function App() {
  const [cashTip, setCashTip] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [ccTip, setCcTip] = useState("");
  const [serverCount, setServerCount] = useState("");
  const [hostCount, setHostCount] = useState("");
  const [cookCount, setCookCount] = useState("");

  const n = (v) => (v === "" ? 0 : parseFloat(v) || 0);

  const result = useMemo(() => {
    const cash = n(cashTip);
    const svc = n(serviceCharge);
    const cc = n(ccTip);
    const servers = n(serverCount);
    const hosts = n(hostCount);
    const cooks = n(cookCount);

    const cdscFee = (svc + cc) * 0.05;
    const pool = svc + cc - cdscFee + cash;

    // Pool is split into equal shares: one per server, one per host,
    // one for all cooks combined, and one house fee share.
    const shares = servers + hosts + 2;
    const unit = pool / shares;

    return {
      cdscFee,
      serverPer: servers > 0 ? unit : null,
      hostPer: hosts > 0 ? unit : null,
      cookPer: cooks > 0 ? unit / cooks : null,
      fee: pool > 0 ? unit : 0,
      servers,
      hosts,
      cooks,
    };
  }, [cashTip, serviceCharge, ccTip, serverCount, hostCount, cookCount]);

  const clearAll = () => {
    setCashTip("");
    setServiceCharge("");
    setCcTip("");
    setServerCount("");
    setHostCount("");
    setCookCount("");
  };

  const hasInput =
    cashTip || serviceCharge || ccTip || serverCount || hostCount || cookCount;

  return (
    <div className="min-h-screen bg-white text-char-950 font-body">
      <div className="max-w-md mx-auto px-4 pt-3 pb-4">
        {/* Header */}
        <header className="mb-3">
          <p className="font-display text-[0.78rem] tracking-[0.3em] text-rust-500 uppercase">
            Kickin&rsquo; Kajun
          </p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <h1 className="font-display text-[1.9rem] leading-[1.05] tracking-tight text-char-950">
              Tip Calculator
            </h1>
            <span className="font-body text-[0.82rem] text-char-400">Kapolei</span>
          </div>
        </header>

        {/* Inputs, 3:2 split, both columns equal height */}
        <section className="grid grid-cols-5 gap-2.5 mb-3 items-stretch">
          <div className="col-span-3 flex flex-col">
            <div className="space-y-2">
              <NumField label="Cash Tip" prefix="$" value={cashTip} onChange={setCashTip} />
              <NumField label="Service Charge" prefix="$" value={serviceCharge} onChange={setServiceCharge} />
              <NumField label="Credit Card Tip" prefix="$" value={ccTip} onChange={setCcTip} />
            </div>
          </div>

          <div className="col-span-2 flex flex-col">
            <div className="flex-1 flex flex-col gap-2">
              <NumField label="Servers" value={serverCount} onChange={setServerCount} placeholder="0" grow />
              <NumField label="Hosts" value={hostCount} onChange={setHostCount} placeholder="0" grow />
              <NumField label="Cooks" value={cookCount} onChange={setCookCount} placeholder="0" grow />
            </div>
          </div>
        </section>

        {/* Payout panel */}
        <section className="border border-char-200 rounded-xl bg-sand/50 px-3 pt-2 pb-2.5">
          <p className="font-display text-[0.82rem] tracking-[0.25em] uppercase text-char-400 text-center mb-2">
            Payout
          </p>

          <div className="space-y-1.5">
            <PayoutRow label="CD/SC Fee" value={result.cdscFee} muted />
            <PayoutRow label="Server" count={result.servers} value={result.serverPer} />
            <PayoutRow label="Host" count={result.hosts} value={result.hostPer} />
            <PayoutRow label="Cook" count={result.cooks} value={result.cookPer} />
            <PayoutRow label="Fee" value={result.fee} muted />
          </div>
        </section>

        <button
          onClick={clearAll}
          disabled={!hasInput}
          className="w-full mt-2.5 py-2.5 rounded-lg border border-char-700 font-display tracking-[0.15em] text-[0.875rem] uppercase text-char-950/60 disabled:opacity-30 active:bg-char-950/5 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
