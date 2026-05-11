import { currentUser } from "@clerk/nextjs/server";

// Placeholder catalogue. The actual artifacts get wired up in step 2.
const artifacts = [
  {
    slug: "sector-intelligence",
    title: "Sector Intelligence Workflow",
    description:
      "Map a target sector's structure, players, and pressures before you pursue accounts inside it.",
  },
  {
    slug: "icp-sweetspot",
    title: "ICP Sweetspot Review",
    description:
      "Pressure-test a target account against your Ideal Customer Profile and see where it fits or doesn't.",
  },
  {
    slug: "opportunity-evaluation",
    title: "Opportunity Evaluation Review",
    description:
      "Score and qualify a live opportunity before investing more time and resources into it.",
  },
  {
    slug: "dealmaker-playbook",
    title: "Dealmaker Playbook",
    description:
      "Strategy playbook for working a complex deal through to close.",
  },
  {
    slug: "call-plan-generator",
    title: "Sales Discovery & Call Plan Generator",
    description:
      "Generate a structured discovery call plan tailored to the account and the stage of conversation.",
  },
];

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome, {firstName}
        </h1>
        <p className="mt-1 text-slate-600">Pick a tool to get started.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {artifacts.map((a) => (
          <div
            key={a.slug}
            className="rounded-lg border border-slate-200 bg-white p-5 opacity-70"
          >
            <h2 className="font-medium text-slate-900">{a.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{a.description}</p>
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
              Coming next
            </p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-slate-400">
        Step 1 of 5: foundation is live. Next: port the first artifact.
      </p>
    </div>
  );
}
