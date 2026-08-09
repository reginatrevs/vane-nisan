import { Masthead } from "@/components/sections/Masthead";
import { DateBlock } from "@/components/sections/DateBlock";
import { Rsvp } from "@/components/sections/Rsvp";
import { Footer } from "@/components/sections/Footer";

export default function Page() {
  return (
    <>
      <main className="bg-paper">
        <Masthead />
        <DateBlock />
        <Rsvp />
      </main>
      <Footer />
    </>
  );
}
