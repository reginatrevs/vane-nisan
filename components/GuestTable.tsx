"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { RsvpRow } from "@/lib/supabase";

type Filter = "all" | "yes" | "no" | "cancelled";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "yes", label: "Attending" },
  { key: "no", label: "Not attending" },
  { key: "cancelled", label: "Cancelled" },
];

function toCsv(rows: RsvpRow[]): string {
  const header = [
    "Name",
    "Attending",
    "Party size",
    "Note",
    "Code",
    "Language",
    "Cancelled",
    "Replied at",
  ];

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;

  const lines = rows.map((r) =>
    [
      r.name,
      r.attending ? "Yes" : "No",
      String(r.attending ? r.party_size : 0),
      r.note ?? "",
      r.code,
      r.locale,
      r.cancelled ? "Yes" : "No",
      new Date(r.created_at).toLocaleString("en-GB"),
    ]
      .map(escape)
      .join(","),
  );

  return [header.map(escape).join(","), ...lines].join("\r\n");
}

export function GuestTable({ rows, slug }: { rows: RsvpRow[]; slug: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "yes" && (!r.attending || r.cancelled)) return false;
      if (filter === "no" && (r.attending || r.cancelled)) return false;
      if (filter === "cancelled" && !r.cancelled) return false;
      if (filter === "all" && r.cancelled) return false;

      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)
      );
    });
  }, [rows, filter, search]);

  async function remove(row: RsvpRow) {
    if (
      !window.confirm(
        `Permanently delete ${row.name} (${row.code})? This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeleting(row.code);
    try {
      const res = await fetch(`/api/list/${slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: row.code }),
      });
      if (!res.ok) {
        window.alert("Could not delete that reply. Please try again.");
        return;
      }
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  function downloadCsv() {
    const blob = new Blob(["\uFEFF" + toCsv(visible)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guest-list-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`border px-3 py-2 text-[10px] uppercase tracking-[0.15em] transition-colors ${
                filter === f.key
                  ? "border-navy bg-navy text-paper"
                  : "border-navy/25 text-navy/70 hover:border-navy/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or code"
            className="min-w-0 flex-1 border border-navy/25 bg-transparent px-3 py-2 text-sm placeholder:text-navy/40 focus:border-navy focus:outline-none sm:w-56 sm:flex-none"
          />
          <button
            type="button"
            onClick={downloadCsv}
            className="shrink-0 border border-navy/30 px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-navy/80 transition-colors hover:border-navy hover:text-navy"
          >
            CSV
          </button>
        </div>
      </div>

      <p className="mb-3 text-xs text-navy/60">
        Showing {visible.length} of {rows.length}
      </p>

      {/* Mobile: cards. Desktop: table. */}
      <ul className="flex flex-col gap-2 md:hidden">
        {visible.map((r) => (
          <li
            key={r.id}
            className="border border-navy/20 bg-paper-warm/30 px-4 py-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-xl text-navy-deep">{r.name}</p>
              <Badge row={r} />
            </div>
            {r.attending && !r.cancelled && (
              <p className="mt-1 text-xs text-navy/70">
                Party of {r.party_size}
              </p>
            )}
            {r.note && (
              <p className="mt-2 border-l-2 border-navy-soft/50 pl-3 text-sm italic text-navy/75">
                {r.note}
              </p>
            )}
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[0.15em] text-navy/45">
                {r.code} · {r.locale}
              </p>
              <DeleteButton
                onClick={() => remove(r)}
                busy={deleting === r.code}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-navy/25 text-[10px] uppercase tracking-[0.15em] text-navy/60">
              <th className="py-3 pr-4 font-normal">Name</th>
              <th className="py-3 pr-4 font-normal">Status</th>
              <th className="py-3 pr-4 font-normal">Party</th>
              <th className="py-3 pr-4 font-normal">Note</th>
              <th className="py-3 pr-4 font-normal">Code</th>
              <th className="py-3 font-normal">
                <span className="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-b border-navy/10 align-top">
                <td className="py-3 pr-4 font-display text-lg text-navy-deep">
                  {r.name}
                </td>
                <td className="py-3 pr-4">
                  <Badge row={r} />
                </td>
                <td className="py-3 pr-4 tabular-nums text-navy/80">
                  {r.attending && !r.cancelled ? r.party_size : "—"}
                </td>
                <td className="max-w-[18rem] py-3 pr-4 italic text-navy/70">
                  {r.note ?? "—"}
                </td>
                <td className="py-3 pr-4 text-xs uppercase tracking-wider text-navy/50">
                  {r.code}
                </td>
                <td className="py-3 text-right">
                  <DeleteButton
                    onClick={() => remove(r)}
                    busy={deleting === r.code}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 && (
        <p className="py-16 text-center text-sm text-navy/50">
          Nothing here yet.
        </p>
      )}
    </div>
  );
}

function DeleteButton({
  onClick,
  busy,
}: {
  onClick: () => void;
  busy: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="shrink-0 border border-navy/20 px-2 py-1 text-[9px] uppercase tracking-[0.15em] text-navy/45 transition-colors hover:border-navy/60 hover:text-navy disabled:opacity-40"
    >
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}

function Badge({ row }: { row: RsvpRow }) {
  const { label, className } = row.cancelled
    ? { label: "Cancelled", className: "border-navy/30 text-navy/50" }
    : row.attending
      ? { label: "Yes", className: "border-navy/50 bg-navy/10 text-navy" }
      : {
          label: "No",
          className: "border-navy/40 bg-navy/5 text-navy",
        };

  return (
    <span
      className={`inline-block shrink-0 border px-2 py-1 text-[9px] uppercase tracking-[0.15em] ${className}`}
    >
      {label}
    </span>
  );
}
