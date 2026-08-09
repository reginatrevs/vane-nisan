import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isCodeShaped, publicRsvp, validateRsvp } from "@/lib/rsvp";

/**
 * The confirmation code is the credential here: you can only edit or
 * cancel a reply if you know the code that was shown when it was made.
 */
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/rsvp/[code]">,
) {
  if (!rateLimit(clientKey(request), { limit: 15, windowMs: 60_000 })) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const { code } = await ctx.params;
  if (!isCodeShaped(code)) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const parsed = validateRsvp(raw);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const { attending, partySize, note } = parsed.value;
  const supabase = supabaseAdmin();

  // Name is intentionally not editable — it's the lookup key.
  const { data, error } = await supabase
    .from("rsvps")
    .update({
      attending,
      party_size: attending ? partySize : 1,
      note,
    })
    .eq("code", code.toUpperCase())
    .eq("cancelled", false)
    .select("code, name, attending, party_size, note")
    .maybeSingle();

  if (error) {
    console.error("rsvp update failed", error);
    return Response.json({ error: "server_error" }, { status: 500 });
  }
  if (!data) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  return Response.json({ rsvp: publicRsvp(data) });
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/rsvp/[code]">,
) {
  if (!rateLimit(clientKey(request), { limit: 15, windowMs: 60_000 })) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const { code } = await ctx.params;
  if (!isCodeShaped(code)) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const supabase = supabaseAdmin();

  // Soft delete: she may still want to know someone dropped out.
  const { data, error } = await supabase
    .from("rsvps")
    .update({ cancelled: true })
    .eq("code", code.toUpperCase())
    .select("code")
    .maybeSingle();

  if (error) {
    console.error("rsvp cancel failed", error);
    return Response.json({ error: "server_error" }, { status: 500 });
  }
  if (!data) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  return Response.json({ cancelled: true });
}
