import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client.
//
// We use the SERVICE_ROLE key here, which bypasses Row-Level Security on the
// database. That's fine — and intentional — because every call goes through
// our Next.js server actions, which already authenticate the user via Clerk
// before touching this client. RLS is left enabled on the table as a safety
// net so the anon key (which is exposed to browsers) can't read or write.
//
// NEVER import this from a Client Component. Only Server Actions, Route
// Handlers, and Server Components are safe.

let cached: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // TEMPORARY: prints to Vercel function logs so we can verify the env var is
  // actually loading the service_role key (not the anon key or undefined).
  // Decode the middle JWT chunk in the log to see "role":"service_role".
  // Remove this block once verified.
  console.log("[supabase-debug]", {
    hasUrl: !!url,
    urlPrefix: url?.slice(0, 40) ?? null,
    hasKey: !!serviceKey,
    keyLen: serviceKey?.length ?? 0,
    keyMiddleSegment: serviceKey?.split(".")[1]
      ? Buffer.from(serviceKey.split(".")[1], "base64").toString("utf8")
      : null,
  });

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase env vars missing. Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  cached = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cached;
}
