import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin, type RsvpRow } from "@/lib/supabase";
import { event } from "@/content/event";
import { GuestTable } from "@/components/GuestTable";

export const metadata: Metadata = {
  title: "Guest list",
  robots: { index: false, follow: false, nocache: true },
};

// Never cache — she needs the live list.
export const dynamic = "force-dynamic";

export default async function Page(props: PageProps<"/list/[slug]">) {
  const { slug } = await props.params;

  const expected = process.env.GUEST_LIST_SLUG;
  if (!expected || slug !== expected) {
    notFound();
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load the guest list: ${error.message}`);
  }

  const rows = (data ?? []) as RsvpRow[];
  const live = rows.filter((r) => !r.cancelled);
  const attending = live.filter((r) => r.attending);
  const declined = live.filter((r) => !r.attending);
  const cancelled = rows.filter((r) => r.cancelled);

  const headcount = attending.reduce((sum, r) => sum + r.party_size, 0);

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.28em] text-navy">
          {event.bride.name} &amp; {event.groom.name}
        </p>
        <h1 className="mt-2 font-display text-4xl text-navy-deep sm:text-5xl">
          Guest list
        </h1>
      </header>

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total attending" value={headcount} highlight />
        <Stat label="Replies: yes" value={attending.length} />
        <Stat label="Replies: no" value={declined.length} />
        <Stat label="Cancelled" value={cancelled.length} />
      </div>

      <GuestTable rows={rows} slug={slug} />
    </main>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border px-4 py-5 ${
        highlight
          ? "border-navy/50 bg-navy/5"
          : "border-navy/20 bg-paper-warm/40"
      }`}
    >
      <p className="font-display text-4xl text-navy-deep">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-navy/70">
        {label}
      </p>
    </div>
  );
}
