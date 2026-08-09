import { useMemo, useState } from "react";

const fmt = (n) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function NumField({
  label,
  value,
  onChange,
  prefix,
  placeholder = "0",
  grow = false,
  money = false,
}) {
  // Money fields stay free-form while typing, then settle to two decimals
  // once the field loses focus.
  const handleChange = (raw) => {
    if (!money) return onChange(raw);
    if (raw === "" || /^\d*\.?\d*$/.test(raw)) onChange(raw);
  };

  const handleBlur = () => {
    if (!money || value === "") return;
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) onChange(parsed.toFixed(2));
  };

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
          type={money ? "text" : "number"}
          inputMode="decimal"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={money ? "0.00" : placeholder}
          className={`w-full bg-transparent font-mono text-char-950 placeholder:text-char-400/40 outline-none text-center ${
            grow ? "text-2xl py-1" : "text-[1.375rem] py-2.5 px-8"
          }`}
        />
      </div>
    </label>
  );
}

function PayoutRow({ label, value }) {
  return (
    <div className="flex justify-between items-center bg-white border border-char-200 rounded-lg px-3.5 py-2">
      <span className="font-mono text-[0.95rem] text-char-950">{label}</span>
      <span className="font-mono text-[1.55rem] font-semibold text-char-950 leading-none">
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

    // Servers take 75% of the pool. The remaining 25% is split three ways:
    // one part to hosts, one to cooks, one kept as the house fee.
    const thirdShare = (pool * 0.25) / 3;

    return {
      cdscFee,
      serverPer: servers > 0 ? (pool * 0.75) / servers : null,
      hostPer: hosts > 0 ? thirdShare / hosts : thirdShare,
      cookPer: cooks > 0 ? thirdShare / cooks : null,
      fee: thirdShare,
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
              <NumField label="Cash Tip" prefix="$" value={cashTip} onChange={setCashTip} money />
              <NumField label="Service Charge" prefix="$" value={serviceCharge} onChange={setServiceCharge} money />
              <NumField label="Credit Card Tip" prefix="$" value={ccTip} onChange={setCcTip} money />
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
            <PayoutRow label="CD/SC Fee" value={result.cdscFee} />
            <PayoutRow label="Server" value={result.serverPer} />
            <PayoutRow label="Host" value={result.hostPer} />
            <PayoutRow label="Cook" value={result.cookPer} />
            <PayoutRow label="Fee" value={result.fee} />
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
