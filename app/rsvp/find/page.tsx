import type { Metadata } from "next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { FindRsvp } from "@/components/FindRsvp";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <LanguageSwitcher />
      <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-24">
        <FindRsvp />
      </main>
    </>
  );
}
