/**
 * ANposting hand-off. Ad Studio never posts and never spends: an approved ad
 * leaves the Studio as a saved-draft payload that ANposting (or the Claude
 * ANposting skill) picks up. The payload is bound to the exact text approved
 * through a SHA-256 hash.
 */
import type { CheckResult } from "./ad-check";
import { collectText } from "./ad-check";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

export function readableId(prefix: string, d = new Date()): string {
  const yymmdd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const bytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(bytes);
  const tail = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `${prefix}-${yymmdd}-${tail}`;
}

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return "sha256:" + Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Guess the platform from the generator scope or route. */
export function platformFromScope(scope: string): string {
  const s = scope.toLowerCase();
  if (/meta|facebook|instagram|reel|lead-form/.test(s)) return "meta";
  if (/tiktok|spark/.test(s)) return "tiktok";
  if (/youtube/.test(s)) return "youtube";
  if (/pinterest/.test(s)) return "pinterest";
  if (/google|pmax|shopping|display/.test(s)) return "google";
  if (/linkedin/.test(s)) return "linkedin";
  if (/twitter|\bx\b/.test(s)) return "x";
  return "other";
}

export interface HandoffPayload {
  schema: "autismandme.adstudio.handoff/1";
  handoff_id: string;
  kind: "paid_ad_creative" | "organic_post";
  source_tool: string;
  platform: string;
  created_at: string;
  text_fields: { where: string; text: string }[];
  content: unknown;
  destination_url: string | null;
  compliance: { verdict: CheckResult["verdict"]; findings: { rule: string; severity: string; match: string }[]; note: string };
  approval: { approved: boolean; content_hash: string; at: string | null };
  jurisdiction: "IE";
  requested_action: "save_draft";
}

export async function buildHandoff(opts: {
  content: unknown;
  scope: string;
  check: CheckResult;
  kind: HandoffPayload["kind"];
  destinationUrl?: string;
  approved: boolean;
}): Promise<HandoffPayload> {
  const json = typeof opts.content === "string" ? opts.content : JSON.stringify(opts.content);
  const hash = await sha256(json);
  const platform = platformFromScope(opts.scope);
  let destination: string | null = null;
  const id = readableId("HND");
  if (opts.destinationUrl && /^https?:\/\//i.test(opts.destinationUrl)) {
    const u = new URL(opts.destinationUrl);
    u.searchParams.set("utm_source", platform);
    u.searchParams.set("utm_medium", opts.kind === "paid_ad_creative" ? "paid" : "social");
    u.searchParams.set("utm_campaign", "ad-studio");
    u.searchParams.set("utm_content", id);
    destination = u.toString();
  }
  return {
    schema: "autismandme.adstudio.handoff/1",
    handoff_id: id,
    kind: opts.kind,
    source_tool: opts.scope,
    platform,
    created_at: new Date().toISOString(),
    text_fields: collectText(opts.content).map(({ where, text }) => ({ where, text })),
    content: opts.content,
    destination_url: destination,
    compliance: {
      verdict: opts.check.verdict,
      findings: opts.check.findings.map((f) => ({ rule: f.rule, severity: f.severity, match: f.match })),
      note: "Ad Check is a helper, not legal or policy clearance.",
    },
    approval: { approved: opts.approved, content_hash: hash, at: opts.approved ? new Date().toISOString() : null },
    jurisdiction: "IE",
    requested_action: "save_draft",
  };
}
