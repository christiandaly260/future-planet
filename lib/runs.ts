// Server-only helpers for reading/writing the artifact_runs table.
// All callers must be Server Actions, Route Handlers, or Server Components —
// this module imports the service_role Supabase client and reads the Clerk
// session, both of which are server-only concerns.
import { currentUser } from "@clerk/nextjs/server";
import { getServerSupabase } from "./supabase";

// Shape of a single row in the artifact_runs table.
// `inputs` and `outputs` are jsonb in Postgres, so artifact-specific structure
// lives entirely inside those — no need to change the schema per artifact.
export type ArtifactRun = {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  artifact_slug: string;
  title: string | null;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  created_at: string;
};

type SaveRunInput = {
  artifactSlug: string;
  title?: string | null;
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
};

// Save a new run for the currently-signed-in user.
// Pulls identity from Clerk, so callers don't pass user info — that prevents
// a malicious client from spoofing user_id by tampering with the request.
export async function saveRun(input: SaveRunInput): Promise<ArtifactRun> {
  const user = await currentUser();
  if (!user) throw new Error("Not signed in");

  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null;

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("artifact_runs")
    .insert({
      user_id: user.id,
      user_email: email,
      user_name: name,
      artifact_slug: input.artifactSlug,
      title: input.title ?? null,
      inputs: input.inputs ?? {},
      outputs: input.outputs ?? {},
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to save run: ${error.message}`);
  return data as ArtifactRun;
}

// List runs for the currently-signed-in user, newest first.
// Used by the future "My runs" view.
export async function listMyRuns(artifactSlug?: string): Promise<ArtifactRun[]> {
  const user = await currentUser();
  if (!user) throw new Error("Not signed in");

  const supabase = getServerSupabase();
  let query = supabase
    .from("artifact_runs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (artifactSlug) query = query.eq("artifact_slug", artifactSlug);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to list runs: ${error.message}`);
  return (data ?? []) as ArtifactRun[];
}

// List runs across the entire team (for the future "Team library" view).
export async function listTeamRuns(artifactSlug?: string): Promise<ArtifactRun[]> {
  const supabase = getServerSupabase();
  let query = supabase
    .from("artifact_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (artifactSlug) query = query.eq("artifact_slug", artifactSlug);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to list team runs: ${error.message}`);
  return (data ?? []) as ArtifactRun[];
}
