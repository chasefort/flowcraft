import type { PlanInput } from "./types";

/** Ready-to-run example briefs so the app is useful with one click. */
export type Sample = { id: string; label: string; blurb: string; input: PlanInput };

export const SAMPLES: Sample[] = [
  {
    id: "b2b-saas",
    label: "B2B SaaS launch",
    blurb: "Project-management tool launching an AI feature",
    input: {
      companyContext:
        "Northwind is a project-management tool for small agencies. We're launching 'Autopilot', an AI feature that drafts status updates and flags at-risk projects automatically.",
      sourceUrl: "northwind.app/autopilot",
      sourceText: "",
      campaignGoal: "Drive sign-ups for the Autopilot beta waitlist",
      audience: "Operations leads and founders at 5–50 person creative agencies",
      brandVoice: "Confident, practical, lightly witty. No hype, no jargon.",
      channels: ["LinkedIn", "X / Twitter", "Newsletter"],
      cadence: "2 week sprint",
    },
  },
  {
    id: "dtc-brand",
    label: "DTC product",
    blurb: "Sustainable coffee brand awareness push",
    input: {
      companyContext:
        "Rowan & Ember is a direct-to-consumer specialty coffee brand focused on traceable, single-origin beans roasted in small batches.",
      sourceUrl: "",
      sourceText:
        "Our beans are sourced directly from farms in Colombia and Ethiopia. We pay above fair-trade prices. Every bag has a QR code that shows the farm, the roast date, and tasting notes. We roast weekly in Portland.",
      campaignGoal: "Build awareness and grow Instagram following ahead of the holiday season",
      audience: "Home coffee enthusiasts aged 25–45 who care about sustainability and provenance",
      brandVoice: "Warm, earthy, story-driven. Sensory and a little poetic.",
      channels: ["Instagram", "Newsletter", "Blog"],
      cadence: "1 month",
    },
  },
  {
    id: "developer-tool",
    label: "Developer tool",
    blurb: "Open-source observability library",
    input: {
      companyContext:
        "Tracelite is an open-source observability library that adds distributed tracing to Node.js apps in three lines of code.",
      sourceUrl: "tracelite.dev",
      sourceText: "",
      campaignGoal: "Grow GitHub stars and get developers to try the quickstart",
      audience: "Backend and platform engineers running Node.js services in production",
      brandVoice: "Technical, precise, no fluff. Respect the reader's time.",
      channels: ["X / Twitter", "Blog", "LinkedIn"],
      cadence: "1 quarter",
    },
  },
];

export const EMPTY_INPUT: PlanInput = {
  companyContext: "",
  sourceUrl: "",
  sourceText: "",
  campaignGoal: "",
  audience: "",
  brandVoice: "",
  channels: ["LinkedIn"],
  cadence: "2 week sprint",
};
