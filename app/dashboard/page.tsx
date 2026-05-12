import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

type Artifact = {
  slug: string;
  title: string;
  description: string;
  ready: boolean;
};

const artifacts: Artifact[] = [
  {
    slug: "sector-intelligence",
    title: "Sector Intelligence Workflow",
    description:
      "Track completed sector intelligence files and launch new sector research runs.",
    ready: true,
  },
  {
    slug: "icp-sweetspot",
    title: "ICP Sweetspot Review",
    description:
      "Pressure-test a target account against your Ideal Customer Profile and see where it fits or doesn't.",
    ready: false,
  },
  {
    slug: "opportunity-evaluation",
    title: "Opportunity Evaluation Review",
    description:
      "Score and qualify a live opportunity before investing more time and resources into it.",
    ready: false,
  },
  {
    slug: "dealmaker-playbook",
    title: "Dealmaker Playbook",
    description:
      "Strategy playbook for working a complex deal through to close.",
    ready: false,
  },
  {
    slug: "call-plan-generator",
    title: "Sales Discovery & Call Plan Generator",
    description:
      "Generate a structured discovery call plan tailored to the account and the stage of conversation.",
    ready: false,
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
        {artifacts.map((a) =>
          a.ready ? (
            <Link
              key={a.slug}
              href={`/dashboard/${a.slug}`}
              className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:shadow-sm"
            >
              <h2 className="font-medium text-slate-900">{a.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{a.description}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-emerald-700">
                Open →
              </p>
            </Link>
          ) : (
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
          )
        )}
      </div>

      <p className="mt-10 text-xs text-slate-400">
        Step 2 of 5: first artifact live with team-shared saves. Next: port the
        remaining four.
      </p>
    </div>
  );
}
