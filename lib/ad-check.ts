/**
 * Autism & Me Ad Check.
 *
 * A deterministic, offline check run on every generated ad (and on anything
 * pasted into /check). It looks for:
 *   - Meta's personal-attributes rule (an ad may not assert or imply that the
 *     person seeing it is autistic, has ADHD, a disability or a condition);
 *   - health, cure and guaranteed-outcome claims;
 *   - deficit language and puzzle-piece imagery;
 *   - social-issue / political wording (Meta stopped running political,
 *     electoral and social-issue ads in the EU in October 2025);
 *   - Autism & Me brand rules (no exclamation marks, the name written
 *     "Autism & Me", no staff–child physical contact in image prompts,
 *     characters only from the approved files);
 *   - output hygiene (links, emails, phone numbers and secrets in ad text).
 *
 * It is a helper, not legal or policy clearance. A blocker always wins over
 * any score.
 */

export type Severity = "blocker" | "review" | "warning";
export type Verdict = "pass" | "pass_with_warning" | "human_review" | "revise";

export interface Finding {
  rule: string;
  category: "meta_policy" | "claims" | "language" | "brand" | "safety" | "social_issue" | "hygiene" | "length";
  severity: Severity;
  match: string;
  where?: string;
  message: string;
  fix: string;
}

export interface CheckResult {
  verdict: Verdict;
  findings: Finding[];
  checkedFields: number;
}

interface Rule {
  id: string;
  category: Finding["category"];
  severity: Severity;
  re: RegExp;
  message: string;
  fix: string;
}

const CONDITIONS =
  "autis\\w*|asd|adhd|neurodivergen\\w*|dyslexi\\w*|dyspraxi\\w*|dyscalculi\\w*|anxiety|anxious|depress\\w*|disab\\w*|special needs|sensory processing disorder|spd|ocd|pda|on the spectrum|diagnos\\w*";

const RULES: Rule[] = [
  // ---- Meta personal attributes ----------------------------------------
  {
    id: "personal_attributes_question",
    category: "meta_policy",
    severity: "blocker",
    re: new RegExp(`\\b(is|are|does|do|has|have)\\s+(you|your\\s+(child|son|daughter|kid|teen|family|student|pupil)s?)\\b[^.?!\\n]{0,30}\\b(${CONDITIONS})`, "i"),
    message: "Asks whether the viewer (or their child) has a condition. Meta rejects ads that assert or imply personal attributes.",
    fix: "Speak about the situation, not the person. For example: \"Resources for families navigating school support.\"",
  },
  {
    id: "personal_attributes_your_condition",
    category: "meta_policy",
    severity: "blocker",
    re: new RegExp(`\\byour\\s+(child'?s\\s+|son'?s\\s+|daughter'?s\\s+|kid'?s\\s+|own\\s+)?(${CONDITIONS})\\b`, "i"),
    message: "\"Your autism\", \"your child's ADHD\" and similar wording implies the viewer's condition. Meta does not allow this.",
    fix: "Name the setting or the need instead: \"support for learners who need a calmer classroom\".",
  },
  {
    id: "personal_attributes_your_autistic_child",
    category: "meta_policy",
    severity: "blocker",
    re: new RegExp(`\\byour\\s+(autistic|adhd|neurodivergent|dyslexic|disabled|anxious)\\b`, "i"),
    message: "\"Your autistic child\" (or similar) implies a personal attribute of the viewer's family.",
    fix: "Use \"autistic learners\", \"children who\" or \"families who\" in the third person.",
  },
  {
    id: "personal_attributes_struggling",
    category: "meta_policy",
    severity: "blocker",
    re: new RegExp(`\\b(struggling|living|coping|dealing|diagnosed)\\s+with\\s+(your\\s+)?(${CONDITIONS})`, "i"),
    message: "\"Struggling with\" or \"diagnosed with\" a condition implies the viewer's health and is deficit framing.",
    fix: "Describe what changes in the environment instead.",
  },
  {
    id: "personal_attributes_you_near_condition",
    category: "meta_policy",
    severity: "review",
    re: new RegExp(`\\b(you|you're|you are)\\b[^.?!\\n]{0,25}\\b(${CONDITIONS})`, "i"),
    message: "\"You\" sits close to a condition word. Meta reviewers may read this as implying the viewer's condition.",
    fix: "Check it reads as being about your work, not the viewer: \"tools that help schools support autistic learners\".",
  },

  // ---- Health and outcome claims ---------------------------------------
  {
    id: "claim_cure",
    category: "claims",
    severity: "blocker",
    re: /\b(cure[sd]?|curing|heal(s|ed|ing)?|reverse[sd]?|recover(y|ed)?\s+from|treat(s|ment|ments)?\s+for|fix(es|ed)?\s+(your|the|my)?\s*(child|kid|son|daughter|behaviou?r|autism))\b/i,
    message: "Cure, treatment or \"fix\" wording. Autism & Me never makes these claims, and Meta treats them as health claims.",
    fix: "Describe the support and the environment: \"a calmer classroom set-up\".",
  },
  {
    id: "claim_guarantee",
    category: "claims",
    severity: "blocker",
    re: /\b(guarantee[sd]?|clinically proven|scientifically proven|100%\s+(results|success|effective)|miracle|instant(ly)?\s+(calm|results)|eliminate[sd]?\s+(meltdowns?|symptoms|behaviou?rs?)|stop(s)?\s+meltdowns?)\b/i,
    message: "Guaranteed or proven-outcome claim.",
    fix: "Say what the resource offers, without promising an outcome.",
  },
  {
    id: "claim_before_after",
    category: "claims",
    severity: "review",
    re: /\bbefore\s+(and|&)\s+after\b/i,
    message: "Before-and-after framing about people is restricted by Meta and does not fit Autism & Me.",
    fix: "Show the environment changing, never a child.",
  },

  // ---- Deficit language -------------------------------------------------
  {
    id: "deficit_suffer",
    category: "language",
    severity: "blocker",
    re: /\b(suffer(s|ing|ers?)?\s+(from|with)|afflicted|stricken|victims?\s+of\s+autism)\b/i,
    message: "Deficit language.",
    fix: "Use neutral wording: \"autistic\", \"who is autistic\".",
  },
  {
    id: "deficit_functioning",
    category: "language",
    severity: "blocker",
    re: /\b(high|low)[-\s]functioning\b|\b(mild(ly)?|severe(ly)?)\s+autis\w*/i,
    message: "Functioning labels and severity labels are not used by Autism & Me.",
    fix: "Describe the support someone needs in a setting instead.",
  },
  {
    id: "deficit_normal",
    category: "language",
    severity: "blocker",
    re: /\bnormal\s+(child|children|kids?|people|students?|pupils?|learners?)\b/i,
    message: "\"Normal children\" sets autistic children against a norm.",
    fix: "Use \"all learners\", \"every child\" or \"non-autistic\" when the contrast matters.",
  },
  {
    id: "deficit_misc",
    category: "language",
    severity: "warning",
    re: /\b(special needs|burden|tragedy|epidemic|what'?s wrong with|disorder|deficits?|challenging behaviou?r|naughty)\b/i,
    message: "Wording that can read as deficit framing.",
    fix: "Prefer \"additional needs\", \"support needs\" or a description of the environment.",
  },
  {
    id: "puzzle_piece",
    category: "brand",
    severity: "blocker",
    re: /puzzle[-\s]?pieces?|\u{1F9E9}/iu,
    message: "Puzzle pieces are never used by Autism & Me.",
    fix: "Use the Autism & Me logo, Blue Cat or Pink Cat from the approved files.",
  },

  // ---- Brand rules -------------------------------------------------------
  {
    id: "brand_exclamation",
    category: "brand",
    severity: "warning",
    re: /!/,
    message: "Exclamation mark. The Autism & Me voice is calm and never uses them.",
    fix: "End the sentence with a full stop.",
  },
  {
    id: "brand_name",
    category: "brand",
    severity: "warning",
    re: /\bautism\s+and\s+me\b|\bautism\s*&amp;\s*me\b/i,
    message: "The name in running text is always \"Autism & Me\".",
    fix: "Write \"Autism & Me\".",
  },
  {
    id: "brand_shouting",
    category: "brand",
    severity: "warning",
    re: /\b[A-Z]{4,}\b(?:\s+\b[A-Z]{3,}\b){1,}/,
    message: "Several words in capitals read as shouting.",
    fix: "Use sentence case.",
  },
  {
    id: "safety_staff_child_contact",
    category: "safety",
    severity: "blocker",
    re: /\b(teacher|staff|adult|assistant|sna|therapist|carer|coach)s?\b[^.\n]{0,60}\b(hug\w*|cuddl\w*|embrac\w*|holding\s+(hands?|the\s+(child|boy|girl|pupil))|hold\w*\s+(his|her|their)\s+hand|hand\s+on\s+(his|her|their)\s+(shoulder|back|arm)|touch\w*|carr(y|ies|ying)|pat(s|ting)?\s+(his|her|their))/i,
    message: "Staff–child physical contact. Autism & Me resources never show an adult touching a child.",
    fix: "Show the adult nearby at the child's level, with space between them, or show the room alone.",
  },
  {
    id: "brand_character_generation",
    category: "brand",
    severity: "review",
    re: /\b(draw|generate|create|render|illustrat\w*|redraw)\b[^.\n]{0,40}\b(blue|pink)\s+cat\b|\b(blue|pink)\s+cat\b[^.\n]{0,40}\b(generated|redrawn|in the style)/i,
    message: "Blue Cat and Pink Cat must come from the approved character files. They are never generated or redrawn.",
    fix: "Ask the image tool for the background only, then place the approved character art on top.",
  },

  // ---- Social issue / political (Meta EU) --------------------------------
  {
    id: "social_issue",
    category: "social_issue",
    severity: "review",
    re: /\b(petition|sign\s+(our|the)\s+(letter|petition)|call\s+on\s+(the\s+)?(minister|government|td|tds|dáil|dail|department)|contact\s+your\s+td|vote|election|lobby\w*|legislation|national\s+(autism\s+)?strategy|policy\s+change|budget\s+20\d\d|campaign\s+for)\b/i,
    message: "Reads as a social-issue or political ad. Meta stopped running political, electoral and social-issue ads in the EU in October 2025, so this may be refused.",
    fix: "Share it as an organic post through ANposting instead of a paid ad.",
  },

  // ---- Hygiene -----------------------------------------------------------
  {
    id: "hygiene_link_in_copy",
    category: "hygiene",
    severity: "warning",
    re: /\bhttps?:\/\/\S+|\bwww\.\S+|\b[\w.+-]+@[\w-]+\.[\w.]+\b|(\+353|\b0)\s?\d{1,3}[\s-]?\d{3}[\s-]?\d{3,4}\b/i,
    message: "A link, email or phone number inside the ad text.",
    fix: "Put the link in the destination field and keep the text clean.",
  },
  {
    id: "hygiene_secret",
    category: "hygiene",
    severity: "blocker",
    re: /\b(sk-[A-Za-z0-9_-]{16,}|sk-ant-[A-Za-z0-9_-]{16,}|AIza[0-9A-Za-z_-]{30,}|gsk_[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,})\b/,
    message: "Looks like an API key or token.",
    fix: "Remove it. Keys never go into ad text.",
  },
];

/** Fold text so hidden or full-width characters cannot slip a word past a rule. */
export function fold(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/[​-‍⁠﻿­]/g, "")
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"');
}

/** Meta and other field caps, matched on the JSON key that holds the text. */
const LENGTH_CAPS: { key: RegExp; max: number; label: string; severity: Severity }[] = [
  { key: /^(primary_?text|primary|body|ad_text)$/i, max: 125, label: "Meta primary text shows about 125 characters before \"See more\"", severity: "warning" },
  { key: /^headlines?$/i, max: 40, label: "Meta headline is cut at about 40 characters", severity: "warning" },
  { key: /^(link_)?descriptions?$/i, max: 90, label: "Descriptions over 90 characters are cut on most placements", severity: "warning" },
];

export interface TextField {
  where: string;
  key: string;
  text: string;
}

/** Walk any JSON value and collect its strings with their path. */
export function collectText(value: unknown, path = "", key = "", out: TextField[] = []): TextField[] {
  if (value == null) return out;
  if (typeof value === "string") {
    if (value.trim()) out.push({ where: path || "text", key, text: value });
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => collectText(v, `${path}[${i}]`, key, out));
  } else if (typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      // Skip the framework explanation block: it describes the ad, it is not the ad.
      if (k === "framework_meta" || k === "rationale" || k === "why") continue;
      collectText(v, path ? `${path}.${k}` : k, k, out);
    }
  }
  return out;
}

const ORDER: Record<Verdict, number> = { pass: 0, pass_with_warning: 1, human_review: 2, revise: 3 };

export function checkFields(fields: TextField[]): CheckResult {
  const findings: Finding[] = [];
  const seen = new Set<string>();
  for (const f of fields) {
    const text = fold(f.text);
    for (const r of RULES) {
      const m = text.match(r.re);
      if (!m) continue;
      const sig = `${r.id}|${m[0].toLowerCase()}`;
      if (seen.has(sig)) continue;
      seen.add(sig);
      findings.push({ rule: r.id, category: r.category, severity: r.severity, match: m[0], where: f.where, message: r.message, fix: r.fix });
    }
    for (const cap of LENGTH_CAPS) {
      if (cap.key.test(f.key) && f.text.length > cap.max) {
        findings.push({
          rule: "length_cap",
          category: "length",
          severity: cap.severity,
          match: `${f.text.length} characters`,
          where: f.where,
          message: cap.label + ".",
          fix: `Shorten to ${cap.max} characters or fewer.`,
        });
      }
    }
  }
  let verdict: Verdict = "pass";
  for (const f of findings) {
    const v: Verdict = f.severity === "blocker" ? "revise" : f.severity === "review" ? "human_review" : "pass_with_warning";
    if (ORDER[v] > ORDER[verdict]) verdict = v;
  }
  const rank: Record<Severity, number> = { blocker: 0, review: 1, warning: 2 };
  findings.sort((a, b) => rank[a.severity] - rank[b.severity]);
  return { verdict, findings, checkedFields: fields.length };
}

export function checkAd(value: unknown): CheckResult {
  return checkFields(collectText(value));
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  pass: "Pass",
  pass_with_warning: "Pass with warnings",
  human_review: "Needs your review",
  revise: "Revise before use",
};
