"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, ShieldAlert, ShieldX, Send, Download } from "lucide-react";
import { checkAd, VERDICT_LABEL, type Finding } from "@/lib/ad-check";
import { buildHandoff, type HandoffPayload } from "@/lib/handoff";

const SEV_STYLE: Record<Finding["severity"], string> = {
  blocker: "border-neg/60 text-neg",
  review: "border-info/60 text-info",
  warning: "border-live/50 text-live",
};
const SEV_LABEL: Record<Finding["severity"], string> = {
  blocker: "Must change",
  review: "Check this",
  warning: "Worth fixing",
};

/**
 * Autism & Me Ad Check plus the ANposting hand-off. Shown under every
 * generator result, and on the /check page for pasted text.
 */
export function AdCheckPanel({ content, scope, showHandoff = true }: { content: unknown; scope: string; showHandoff?: boolean }) {
  const result = useMemo(() => checkAd(content), [content]);
  const [approved, setApproved] = useState(false);
  const [kind, setKind] = useState<HandoffPayload["kind"]>("paid_ad_creative");
  const [dest, setDest] = useState("https://www.autismandme.ie/");
  const [status, setStatus] = useState<string | null>(null);

  const Icon = result.verdict === "revise" ? ShieldX : result.verdict === "pass" ? ShieldCheck : ShieldAlert;
  const tone =
    result.verdict === "revise" ? "border-neg/60 bg-neg/[0.06]" : result.verdict === "pass" ? "border-pos/60 bg-pos/[0.06]" : "border-live/50 bg-live/[0.05]";
  const blocked = result.verdict === "revise";

  async function handoff(mode: "copy" | "download") {
    const payload = await buildHandoff({ content, scope, check: result, kind, destinationUrl: dest, approved });
    const json = JSON.stringify(payload, null, 2);
    if (mode === "copy") {
      try {
        await navigator.clipboard.writeText(json);
        setStatus(`Copied ${payload.handoff_id}. Paste it into ANposting, or ask Claude to save it as an ANposting draft.`);
      } catch {
        setStatus("Copy was blocked by the browser. Use Download instead.");
      }
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      a.download = `${payload.handoff_id}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      setStatus(`Saved ${payload.handoff_id}.json.`);
    }
  }

  return (
    <section aria-labelledby="adcheck-h" className={`border ${tone} p-5 space-y-4`}>
      <div className="flex items-start gap-3">
        <Icon size={22} className="shrink-0 mt-0.5 text-ink" aria-hidden />
        <div>
          <h2 id="adcheck-h" className="text-lg text-ink font-semibold">
            Ad Check: {VERDICT_LABEL[result.verdict]}
          </h2>
          <p className="text-ink-muted text-sm">
            Meta policy, claims, language and the Autism &amp; Me brand rules. {result.checkedFields} text field
            {result.checkedFields === 1 ? "" : "s"} checked. This is a helper, not legal or policy clearance.
          </p>
        </div>
      </div>

      {result.findings.length ? (
        <ul className="space-y-2">
          {result.findings.map((f, i) => (
            <li key={i} className={`border-l-4 ${SEV_STYLE[f.severity]} bg-base-900/50 px-3 py-2`}>
              <div className="text-sm font-semibold">
                {SEV_LABEL[f.severity]} · <span className="text-ink">&ldquo;{f.match}&rdquo;</span>
                {f.where ? <span className="text-ink-subtle font-normal"> in {f.where}</span> : null}
              </div>
              <div className="text-sm text-ink-muted">{f.message}</div>
              <div className="text-sm text-ink">Fix: {f.fix}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink">Nothing found. Read it once more yourself before it goes out.</p>
      )}

      {showHandoff ? (
        <div className="border-t border-base-600 pt-4 space-y-3">
          <h3 className="text-base text-ink font-semibold">Send to ANposting</h3>
          <p className="text-sm text-ink-muted">
            Ad Studio never posts and never spends. This makes a saved-draft file for ANposting. Paid ads are set up in
            Meta Ads Manager.
          </p>
          <div className="flex flex-wrap gap-3 items-end">
            <label className="text-sm text-ink-muted">
              <span className="block mb-1">Type</span>
              <select className="input-base w-auto" value={kind} onChange={(e) => setKind(e.target.value as HandoffPayload["kind"])}>
                <option value="paid_ad_creative">Paid ad</option>
                <option value="organic_post">Organic post</option>
              </select>
            </label>
            <label className="text-sm text-ink-muted flex-1 min-w-[240px]">
              <span className="block mb-1">Destination page</span>
              <input className="input-base" value={dest} onChange={(e) => setDest(e.target.value)} inputMode="url" />
            </label>
          </div>
          <label className="flex items-start gap-2 text-sm text-ink">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[#F2863D]"
              checked={approved}
              disabled={blocked}
              onChange={(e) => setApproved(e.target.checked)}
            />
            <span>
              I have read this ad and approve it.
              {blocked ? <span className="block text-neg">Fix the &ldquo;Must change&rdquo; items first.</span> : null}
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary" disabled={!approved || blocked} onClick={() => handoff("copy")}>
              <Send size={14} aria-hidden /> Copy for ANposting
            </button>
            <button type="button" className="btn-ghost" disabled={!approved || blocked} onClick={() => handoff("download")}>
              <Download size={14} aria-hidden /> Download draft file
            </button>
          </div>
          {status ? (
            <p role="status" className="text-sm text-ink">
              {status}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
