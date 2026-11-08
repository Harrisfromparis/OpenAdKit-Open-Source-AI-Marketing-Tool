import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "About" };

const RULES = [
  "The brand kit comes first: cream, teal and orange palette, Poppins headings, Atkinson Hyperlegible body text, 18px body and never under 16px.",
  "Orange is for one call to action per screen, always with black text on it. Never white text on orange or dusty blue.",
  "Blue Cat and Pink Cat appear only from the approved character files. They are never redrawn or regenerated, and Pink Cat is never mirrored.",
  "No puzzle pieces, no deficit language, no exclamation marks, and no autoplay or flashing motion.",
  "No staff–child physical contact in any image or scene.",
  "Ads never say or hint that the person seeing them is autistic, has ADHD or any other condition. Meta does not allow it, and it is not how we talk.",
  "No cure, fix, treatment or guaranteed-outcome claims.",
  "Ad Studio prepares ads. It never posts and never spends. Publishing happens in ANposting or Meta Ads Manager, after you approve.",
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader scope="about" title="About Ad Studio" subtitle="Autism & Me · Change the environment, not the child." />

      <section className="card mb-6 space-y-3">
        <h2 className="text-2xl text-ink">What this is</h2>
        <p className="text-ink-muted leading-relaxed">
          Ad Studio is the Autism &amp; Me workspace for planning, writing and checking ads for Meta (Facebook and
          Instagram), Google, TikTok, YouTube and Pinterest. It works with your own AI key, keeps your work in this
          browser, and hands finished drafts to ANposting.
        </p>
        <p className="text-ink-muted leading-relaxed">
          Before you use any ad, run it through <Link href="/check" className="text-live underline">Ad Check</Link>.
          It looks for wording Meta rejects, claims we never make and language that does not fit Autism &amp; Me. It is a
          helper, not legal or policy clearance.
        </p>
      </section>

      <section className="card mb-6">
        <h2 className="text-2xl text-ink mb-3">House rules built into the Studio</h2>
        <ul className="space-y-2 text-ink-muted leading-relaxed list-disc pl-5">
          {RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2 className="text-2xl text-ink mb-3">Credits and licence</h2>
        <p className="text-ink-muted leading-relaxed">
          Ad Studio is built on{" "}
          <a
            href="https://github.com/IamRamgarhia/OpenAdKit-Open-Source-AI-Marketing-Tool"
            target="_blank"
            rel="noreferrer"
            className="text-live underline"
          >
            OpenAdKit
          </a>{" "}
          by Dicecodes, used under the MIT licence. The original copyright and licence notice are kept in the LICENSE and
          NOTICE.md files of this repository. Autism &amp; Me changes: brand kit, Ad Check, ANposting hand-off, and the
          removal of third-party page readers.
        </p>
        <p className="text-ink-faint mt-4">Autism &amp; Me · autismandme.ie · {new Date().getFullYear()}</p>
      </section>
    </div>
  );
}
