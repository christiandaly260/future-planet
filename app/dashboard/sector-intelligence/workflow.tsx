"use client";

import { useState, useTransition } from "react";
import {
  KNOWLEDGE_BASE,
  GEOGRAPHIES,
  QUICK_LAUNCH_SECTORS,
  type ActionType,
} from "./knowledge-base";
import { savePromptRun } from "./actions";

type PromptState = {
  prompt: string;
  saved: boolean; // true once the server has acknowledged the save
} | null;

export default function SectorIntelligenceWorkflow() {
  const [sectorInput, setSectorInput] = useState("");
  const [geo, setGeo] = useState(GEOGRAPHIES[0]);
  const [prompt, setPrompt] = useState<PromptState>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const totalCompanies = KNOWLEDGE_BASE.sectors.reduce(
    (sum, s) => sum + s.companies,
    0
  );

  // Single entry point — every "generate prompt" path (launcher button, quick
  // chips, per-card actions) funnels through here so the save behavior is
  // consistent.
  function generate(action: ActionType, sector: string, geoOverride?: string) {
    const trimmed = sector.trim();
    if (!trimmed) return;
    setError(null);
    setCopied(false);
    setPrompt(null);

    startTransition(async () => {
      try {
        const result = await savePromptRun({
          action,
          sector: trimmed,
          geo: geoOverride ?? geo,
        });
        setPrompt({ prompt: result.prompt, saved: true });
        // Scroll the prompt box into view on next paint.
        requestAnimationFrame(() => {
          document
            .getElementById("prompt-box")
            ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save run");
      }
    });
  }

  async function handleCopy() {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API can fail in older Safari / non-https — surface a hint.
      setError("Couldn't copy automatically. Select the prompt text manually.");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Sector Intelligence Workflow
        </h1>
        <p className="mt-1 text-slate-600">
          Track completed sector files and launch new sector research runs.
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Sectors covered" value={KNOWLEDGE_BASE.sectors.length} />
        <StatCard label="Companies profiled" value={totalCompanies} />
        <StatCard
          label="Last updated"
          value={KNOWLEDGE_BASE.lastUpdated}
          small
        />
      </div>

      {/* Completed sector files */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Completed files
        </h2>
        <div className="space-y-3">
          {KNOWLEDGE_BASE.sectors.map((s) => (
            <div
              key={s.name}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="font-medium text-slate-900">{s.name}</div>
                <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  Complete
                </span>
              </div>
              <div className="text-xs leading-relaxed text-slate-500">
                {s.geo} · {s.companies} companies · {s.tiers} tiers · updated {s.date}
                <div className="mt-1 text-[11px] text-slate-400">
                  {s.highlights}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <SmallButton
                  disabled={isPending}
                  onClick={() => generate("enrich", s.name, s.geo)}
                >
                  Enrich
                </SmallButton>
                <SmallButton
                  disabled={isPending}
                  onClick={() => generate("add-companies", s.name, s.geo)}
                >
                  Add companies
                </SmallButton>
                <SmallButton
                  disabled={isPending}
                  onClick={() => generate("refresh", s.name, s.geo)}
                >
                  Refresh data
                </SmallButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Launcher */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Launch new sector
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Sector</label>
              <input
                type="text"
                value={sectorInput}
                onChange={(e) => setSectorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") generate("launch", sectorInput);
                }}
                placeholder="e.g. Pharma, ICT, Retail…"
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">
                Geography
              </label>
              <select
                value={geo}
                onChange={(e) => setGeo(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-500"
              >
                {GEOGRAPHIES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            disabled={isPending || !sectorInput.trim()}
            onClick={() => generate("launch", sectorInput)}
            className="mt-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Generate prompt to paste into chat"}
          </button>

          <div className="my-4 h-px bg-slate-100" />

          <div className="text-xs text-slate-500">
            Quick launch — click a sector to generate its prompt
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_LAUNCH_SECTORS.map((s) => (
              <button
                key={s}
                disabled={isPending}
                onClick={() => generate("launch", s)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 transition hover:border-slate-400 disabled:opacity-50"
              >
                {s.replace(" and ", " & ")}
              </button>
            ))}
          </div>

          {/* Prompt output */}
          {prompt && (
            <div
              id="prompt-box"
              className="mt-5 rounded-md bg-slate-50 px-4 py-3"
            >
              <div className="text-xs text-slate-500">
                Prompt ready — copy and paste into the chat below
              </div>
              <div className="my-2 break-words text-sm leading-relaxed text-slate-900">
                {prompt.prompt}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-900 hover:bg-slate-50"
                >
                  Copy prompt
                </button>
                {copied ? (
                  <span className="text-xs font-medium text-emerald-700">
                    Copied to clipboard
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">
                    Then paste into the chat box
                  </span>
                )}
                {prompt.saved && (
                  <span className="ml-auto text-[11px] text-slate-400">
                    Saved to team library
                  </span>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Activity feed */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Recent activity
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white">
          {KNOWLEDGE_BASE.activity.map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"
            >
              <div
                className={
                  "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full " +
                  (a.type === "green" ? "bg-emerald-600" : "bg-amber-600")
                }
              />
              <div className="flex-1 text-xs leading-relaxed text-slate-700">
                {a.text}
              </div>
              <div className="shrink-0 text-[11px] text-slate-400">
                {a.date}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] italic text-slate-400">
          Knowledge base is currently fixed in code. Editable team knowledge
          base coming in a later step.
        </p>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  small,
}: {
  label: string;
  value: string | number;
  small?: boolean;
}) {
  return (
    <div className="rounded-lg bg-slate-100 px-4 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div
        className={
          "mt-1 font-medium text-slate-900 " + (small ? "text-sm" : "text-2xl")
        }
      >
        {value}
      </div>
    </div>
  );
}

function SmallButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}
