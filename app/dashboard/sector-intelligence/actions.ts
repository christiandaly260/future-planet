"use server";

import { saveRun } from "@/lib/runs";
import { buildPrompt, type ActionType } from "./knowledge-base";

// Server action invoked by the client when a prompt is generated.
//
// Re-builds the prompt server-side from (action, sector, geo) so the client
// can't smuggle arbitrary text into the audit trail — the saved prompt always
// matches what our buildPrompt() would produce.
export async function savePromptRun(input: {
  action: ActionType;
  sector: string;
  geo: string;
}): Promise<{ ok: true; runId: string; prompt: string }> {
  const prompt = buildPrompt(input.action, input.sector, input.geo);

  const run = await saveRun({
    artifactSlug: "sector-intelligence",
    title: `${input.action}: ${input.sector} (${input.geo})`,
    inputs: {
      action: input.action,
      sector: input.sector,
      geo: input.geo,
    },
    outputs: {
      prompt,
    },
  });

  return { ok: true, runId: run.id, prompt };
}
