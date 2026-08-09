import { supabaseAdmin } from "@/lib/supabase";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isCodeShaped, publicRsvp } from "@/lib/rsvp";

const COLUMNS = "code, name, attending, party_size, note";

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request), { limit: 20, windowMs: 60_000 })) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const query =
    typeof (raw as { query?: unknown })?.query === "string"
      ? (raw as { query: string }).query.trim()
      : "";

  // The confirmation code is the only way in. Looking a reply up by name
  // would let anyone view, edit or cancel someone else's reply just by
  // knowing their name — and would break for two guests with the same name.
  if (!isCodeShaped(query)) {
    return Response.json({ rsvp: null }, { status: 404 });
  }

  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("rsvps")
    .select(COLUMNS)
    .eq("code", query.toUpperCase())
    .eq("cancelled", false)
    .maybeSingle();

  if (error) {
    console.error("rsvp lookup failed", error);
    return Response.json({ error: "server_error" }, { status: 500 });
  }

  if (!data) {
    return Response.json({ rsvp: null }, { status: 404 });
  }

  return Response.json({ rsvp: publicRsvp(data) });
}
