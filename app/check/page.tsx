"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { AdCheckPanel } from "@/components/AdCheckPanel";

const EXAMPLE = `Headline: Calmer classrooms start with the room
Primary text: Free UDL lesson cards for Irish teachers. Plan one change to the environment this week and see who it helps.`;

export default function CheckPage() {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState("meta");
  const [checked, setChecked] = useState<string | null>(null);

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        scope="check"
        title="Ad Check"
        subtitle="Paste any ad, post or image prompt. Ad Studio checks it against Meta policy and the Autism & Me rules."
      />
      <div className="card space-y-4">
        <label className="block">
          <span className="label">Platform</span>
          <select className="input-base w-auto" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="meta">Meta (Facebook and Instagram)</option>
            <option value="tiktok">TikTok</option>
            <option value="pinterest">Pinterest</option>
            <option value="youtube">YouTube</option>
            <option value="google">Google</option>
          </select>
        </label>
        <label className="block">
          <span className="label">Ad text or image prompt</span>
          <textarea
            className="input-base min-h-[180px] leading-relaxed"
            value={text}
            placeholder={EXAMPLE}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <button type="button" className="btn-primary" disabled={!text.trim()} onClick={() => setChecked(text)}>
          Check this ad
        </button>
      </div>
      {checked ? <AdCheckPanel content={checked} scope={`check/${platform}`} /> : null}
    </div>
  );
}
