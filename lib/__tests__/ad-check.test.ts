import { describe, it, expect } from "vitest";
import { checkAd, fold } from "@/lib/ad-check";

const rules = (v: unknown) => checkAd(v).findings.map((f) => f.rule);

describe("ad-check: Meta personal attributes", () => {
  it("blocks questions about the viewer's condition", () => {
    expect(checkAd("Is your child autistic? Get our guide.").verdict).toBe("revise");
    expect(rules("Are you struggling with ADHD?")).toContain("personal_attributes_question");
    expect(rules("Help for your child's autism")).toContain("personal_attributes_your_condition");
    expect(rules("Calm tools for your autistic son")).toContain("personal_attributes_your_autistic_child");
  });
  it("passes third-person, environment-first wording", () => {
    const r = checkAd({ headline: "Calmer classrooms", primary_text: "Free lesson cards that help schools plan for every learner." });
    expect(r.verdict).toBe("pass");
  });
  it("does not treat the verb 'add' as a condition", () => {
    expect(rules("Do you want to add a quiet corner to your room?")).not.toContain("personal_attributes_question");
  });
});

describe("ad-check: claims and language", () => {
  it("blocks cure and guarantee claims", () => {
    expect(rules("A proven way to cure autism")).toContain("claim_cure");
    expect(rules("Guaranteed results in two weeks")).toContain("claim_guarantee");
    expect(rules("Stop meltdowns fast")).toContain("claim_guarantee");
  });
  it("blocks deficit language and puzzle pieces", () => {
    expect(rules("children suffering from autism")).toContain("deficit_suffer");
    expect(rules("high-functioning learners")).toContain("deficit_functioning");
    expect(rules("just like normal kids")).toContain("deficit_normal");
    expect(rules("our puzzle piece logo")).toContain("puzzle_piece");
    expect(rules("\u{1F9E9} awareness")).toContain("puzzle_piece");
  });
  it("folds hidden characters", () => {
    expect(fold("cu​re")).toBe("cure");
    expect(rules("cu​re autism")).toContain("claim_cure");
  });
});

describe("ad-check: brand, safety, social issue, length", () => {
  it("warns on exclamation marks and the name", () => {
    const r = checkAd("Join Autism and Me today!");
    expect(r.verdict).toBe("pass_with_warning");
    expect(r.findings.map((f) => f.rule)).toEqual(expect.arrayContaining(["brand_exclamation", "brand_name"]));
  });
  it("blocks staff-child contact in image prompts", () => {
    expect(rules({ image_prompt: "A teacher hugging a young pupil in a bright classroom" })).toContain("safety_staff_child_contact");
    expect(rules({ image_prompt: "A teacher kneels at a child's level, a little apart, pointing to a picture card" })).not.toContain("safety_staff_child_contact");
  });
  it("routes social-issue wording to human review", () => {
    expect(checkAd("Sign the petition: call on the Minister to keep diagnosis for special classes.").verdict).toBe("human_review");
  });
  it("flags long Meta headlines and primary text", () => {
    const r = checkAd({ headline: "A".repeat(10) + " calm lesson cards for every single classroom in Ireland", primary_text: "x ".repeat(80) });
    expect(r.findings.filter((f) => f.rule === "length_cap").length).toBe(2);
  });
  it("ignores the framework explanation block", () => {
    expect(checkAd({ framework_meta: { note: "Avoid 'cure' language!" }, headline: "Calm lesson cards" }).verdict).toBe("pass");
  });
  it("blocks API keys", () => {
    expect(rules("key sk-ant-abcdefghijklmnopqrstuvwxyz")).toContain("hygiene_secret");
  });
});
