import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isCodeShaped } from "@/lib/rsvp";

/**
 * Permanently deletes a reply. Only reachable from the guest list page, and
 * the secret slug in the URL is the credential — same one that guards the
 * page itself. This is a hard delete: it's how she removes an accidental
 * duplicate, so leaving a cancelled row behind would defeat the point.
 */
export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/list/[slug]">,
) {
  if (!rateLimit(clientKey(request), { limit: 30, windowMs: 60_000 })) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const { slug } = await ctx.params;
  const expected = process.env.GUEST_LIST_SLUG;
  if (!expected || slug !== expected) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const code = (raw as { code?: unknown })?.code;
  if (typeof code !== "string" || !isCodeShaped(code)) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("rsvps")
    .delete()
    .eq("code", code.toUpperCase())
    .select("code")
    .maybeSingle();

  if (error) {
    console.error("rsvp delete failed", error);
    return Response.json({ error: "server_error" }, { status: 500 });
  }
  if (!data) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  return Response.json({ deleted: true });
}
