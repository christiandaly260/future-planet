// Knowledge base for the Sector Intelligence Workflow artifact.
//
// TODO (Step 4/5): Move this to Supabase so the team can edit sector entries
// collaboratively from the UI. For now it's hardcoded to keep Step 2 simple —
// it's still a clean lift of what was in the original Cowork artifact.

export type SectorEntry = {
  name: string;
  geo: string;
  companies: number;
  tiers: number;
  date: string;
  file: string;
  highlights: string;
  history: { event: string; date: string }[];
};

export type ActivityEntry = {
  text: string;
  date: string;
  type: "green" | "amber";
};

export const KNOWLEDGE_BASE = {
  lastUpdated: "1 May 2026 (Healthcare added)",
  sectors: [
    {
      name: "Food Manufacturers & Co-operatives",
      geo: "Ireland",
      companies: 23,
      tiers: 4,
      date: "May 2026",
      file: "Ireland_Food_Intelligence_Enriched.xlsx",
      highlights:
        "Kerry Group, Glanbia, ABP, Ornua, Tirlán, ARYZTA, C&C Group, Moy Park, Monaghan Mushrooms, Bewley's, Flahavan's + more",
      history: [
        {
          event:
            "Enriched with 10 mid-tier & specialist firms (Monaghan Mushrooms, Keelings, Tayto Snacks, C&C Group, ARYZTA, Rosderra, Liffey Meats, Moy Park, Bewley's, Flahavan's)",
          date: "May 2026",
        },
        { event: "Original file delivered — 13 companies, 4 tiers", date: "Apr 2026" },
      ],
    },
    {
      name: "Construction & Engineering",
      geo: "Ireland",
      companies: 16,
      tiers: 5,
      date: "Apr 2026",
      file: "Ireland_Construction_Intelligence.xlsx",
      highlights:
        "CRH, Kingspan, Cairn Homes, Glenveagh, Sisk, Mercury, Winthrop, Jones Engineering, PM Group + more",
      history: [
        { event: "Original file delivered — 16 companies, 5 tiers", date: "Apr 2026" },
      ],
    },
    {
      name: "Utilities",
      geo: "Ireland",
      companies: 12,
      tiers: 4,
      date: "May 2026",
      file: "Ireland_Utilities_Intelligence.xlsx",
      highlights:
        "ESB, Uisce Éireann, EirGrid, Gas Networks Ireland, SSE Airtricity, Bord Gáis Energy, Statkraft, Veolia, Flogas, NTR, Pinergy",
      history: [
        {
          event:
            "Enrichment in progress — GMC, FLI & utility infrastructure contractors",
          date: "May 2026",
        },
        { event: "Original file delivered — 12 companies, 4 tiers", date: "May 2026" },
      ],
    },
    {
      name: "Transport & Logistics",
      geo: "Ireland",
      companies: 15,
      tiers: 4,
      date: "May 2026",
      file: "Ireland_Transport_Logistics_Intelligence.xlsx",
      highlights:
        "Ryanair, DAA, An Post, Bus Éireann, Irish Continental Group, Dublin Bus, Iarnród Éireann, ASL Aviation, DPD Ireland, Dublin Port, Stena Line, Shannon Foynes Port, Transdev (Luas), DSV, Kuehne+Nagel",
      history: [
        {
          event:
            "Original file delivered — 15 companies across airlines, ports, rail, bus, parcel, freight forwarding & tram; 4 tiers",
          date: "May 2026",
        },
      ],
    },
    {
      name: "Healthcare",
      geo: "Ireland",
      companies: 16,
      tiers: 4,
      date: "May 2026",
      file: "Ireland_Healthcare_Intelligence.xlsx",
      highlights:
        "HSE, Uniphar, VHI, Bon Secours, Children's Health Ireland, Mater Private, Blackrock Health, Beacon Hospital, Emeis Ireland, Centric Health, Virtue Elder Care, Affidea, Mowlam, UPMC Ireland, Bartra, Well Pharmacy",
      history: [
        {
          event:
            "Original file delivered — 16 organisations across hospitals, health insurance, pharmacy, primary care, nursing homes & specialist services; 4 tiers",
          date: "May 2026",
        },
      ],
    },
  ] as SectorEntry[],
  activity: [
    {
      text: "Ireland Healthcare Intelligence.xlsx delivered — 16 organisations, 4 tiers (hospitals, health insurance, pharma distribution, primary care, nursing homes)",
      date: "May 2026",
      type: "green",
    },
    {
      text: "Ireland Transport & Logistics Intelligence.xlsx delivered — 15 companies, 4 tiers (airlines, ports, rail, bus, parcel, freight forwarding)",
      date: "May 2026",
      type: "green",
    },
    {
      text: "Food file enriched — grew from 13 to 23 companies; 10 mid-tier & specialist additions",
      date: "May 2026",
      type: "green",
    },
    {
      text: "Utilities sector enrichment requested — GMC, FLI & utility infrastructure contractors",
      date: "May 2026",
      type: "amber",
    },
    {
      text: "Ireland Utilities Intelligence.xlsx delivered — 12 companies, 4 tiers",
      date: "May 2026",
      type: "green",
    },
    {
      text: "Ireland Construction & Engineering Intelligence.xlsx delivered — 16 companies, 5 tiers",
      date: "Apr 2026",
      type: "green",
    },
    {
      text: "Ireland Food Manufacturers & Co-operatives Intelligence.xlsx delivered — 13 companies",
      date: "Apr 2026",
      type: "green",
    },
  ] as ActivityEntry[],
};

export const GEOGRAPHIES = [
  "Ireland",
  "Ireland and Northern Ireland",
  "Northern Ireland",
  "Ireland — Munster region",
  "Ireland — Leinster region",
  "UK",
  "Europe",
];

export const QUICK_LAUNCH_SECTORS = [
  "Pharma and Life Sciences",
  "ICT and Technology",
  "Financial Services",
  "Retail and FMCG",
  "Transport and Logistics",
  "Healthcare",
  "Education",
  "Hospitality and Tourism",
];

// Prompt builders — pure functions so they can also be called from the server
// action without duplicating string-building logic.
export type ActionType = "launch" | "enrich" | "add-companies" | "refresh";

export function buildPrompt(
  action: ActionType,
  sector: string,
  geo: string
): string {
  switch (action) {
    case "launch":
      return `Build a company intelligence Excel file for the ${sector} sector in ${geo} — follow the sector-specific intelligence workflow`;
    case "enrich":
      return `Enrich the ${geo} ${sector} intelligence file with additional companies, updated leadership and any new sustainability or procurement data`;
    case "add-companies":
      return `Add more companies to the ${geo} ${sector} intelligence file — focus on mid-tier and specialist firms not yet covered`;
    case "refresh":
      return `Refresh the ${geo} ${sector} intelligence file with the latest 2025–26 data — update financials, leadership changes and sustainability ratings`;
  }
}
