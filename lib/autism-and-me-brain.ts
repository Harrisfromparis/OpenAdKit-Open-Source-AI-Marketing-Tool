import { emptyBrandBrain, type BrandBrain } from "./brand-brain";

/**
 * Ready-made Brand Brain for Autism & Me. Facts only: no invented reviews,
 * figures or customer quotes. Proof and real customer language are left
 * empty for Elaine to add when she has them (consented).
 */
export function autismAndMeBrain(): BrandBrain {
  const b = emptyBrandBrain();
  return {
    ...b,
    name: "Autism & Me",
    business_name: "Autism & Me",
    industry: "Inclusive education and Universal Design for Learning (UDL)",
    niche: "Neuroinclusive education consultancy, resources and design lab in Ireland",
    website_url: "https://www.autismandme.ie",
    products: [
      "Free UDL lesson cards (Six Steps and Three Steps)",
      "Education Hub tools: Sensory Load Simulation, UDL Planning Studio, Junior Cycle English, History, Maths and Art workbooks",
      "iLEARN: lesson planning and the Teacher Dashboard",
      "Quiet Comic Corner: calm Blue Cat and Pink Cat comics for children",
      "RSE & Me relationships and sexuality education toolkit",
      "UDL consultancy, and school and workplace audits",
      "Universal Design Mark accreditation",
      "Books on Amazon KDP, including the iLEARN uGuide line",
    ],
    platforms: ["Facebook", "Instagram", "TikTok", "Threads", "Pinterest", "YouTube"],
    content_pillars: [
      "Change the environment, not the child",
      "Practical UDL ideas for Irish classrooms",
      "Free resources from the Education Hub",
      "Blue Cat and Pink Cat",
      "Inclusive policy and systems (organic posts only)",
    ],
    social_links: {},
    tone: "Calm, warm, plain Irish English. Respectful and practical. Never hype, never urgent, never an exclamation mark.",
    personality_traits: ["calm", "warm", "practical", "respectful", "hopeful", "plain-spoken"],
    writing_style: "Short sentences, one idea per line, everyday words. Talk about the room, the routine and the plan adapting, not about fixing a person.",
    words_to_use: ["environment", "access", "calm", "plan", "every learner", "Universal Design", "UDL", "free", "Ireland", "support"],
    words_to_avoid: [
      "suffering from",
      "afflicted",
      "high functioning",
      "low functioning",
      "normal children",
      "special needs",
      "disorder",
      "cure",
      "fix",
      "guaranteed",
      "puzzle piece",
      "challenging behaviour",
    ],
    audience_who: "Teachers, special education teachers and coordinators, school leaders, parents and families, and workplaces in Ireland who want settings that work for everyone.",
    audience_pain_points: [
      "Too little time to plan for every learner",
      "Unclear next steps for making a classroom more inclusive",
      "Resources that are not written for the Irish curriculum",
      "Hard to know where to start with UDL",
    ],
    audience_desires: [
      "Calm, practical tools they can use this week",
      "Classrooms and workplaces where everyone can take part",
      "Plain guidance that respects the people it is about",
    ],
    audience_demographics: "Adults in Ireland. Do not target by health condition or disability.",
    service_area: "Ireland (based in Waterford)",
    usp: "Universal Design first: Autism & Me changes the environment, not the child, with free and practical tools built for Irish schools.",
    key_benefits: [
      "Free, ready-to-use UDL resources",
      "Built around the Irish curriculum",
      "Low-sensory, accessible design",
      "Created by a qualified teacher and UDL advocate",
    ],
    key_messages: ["Change the environment, not the child.", "The system adapts, not the learner."],
    objections: ["I don't have time to plan for every learner."],
    objection_handling: ["Start with one change to the room this week. The lesson cards take one step at a time."],
    competitors: [],
    differentiators: ["Universal Design first", "Irish curriculum", "Free core resources", "Calm, low-sensory design"],
    price_positioning: "Free core resources; paid consultancy, audits, accreditation and books.",
    voc_phrases: [],
    voc_pain_quotes: [],
    voc_success_quotes: [],
    best_performing_angles: [],
    failed_angles: [],
    pending_user_input: ["voc_phrases", "voc_success_quotes", "social_links"],
  };
}
