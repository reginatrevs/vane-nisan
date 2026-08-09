import { supabaseAdmin } from "@/lib/supabase";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { generateCode, nameKey, publicRsvp, validateRsvp } from "@/lib/rsvp";

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request), { limit: 8, windowMs: 60_000 })) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
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

  const { name, attending, partySize, note, locale } = parsed.value;
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("rsvps")
    .insert({
      code: generateCode(),
      name,
      name_key: nameKey(name),
      attending,
      party_size: attending ? partySize : 1,
      note,
      locale,
    })
    .select("code, name, attending, party_size, note")
    .single();

  if (error) {
    console.error("rsvp insert failed", error);
    return Response.json({ error: "server_error" }, { status: 500 });
  }

  return Response.json({ rsvp: publicRsvp(data) }, { status: 201 });
}
