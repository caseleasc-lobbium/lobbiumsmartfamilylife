import SharedHero from "@/components/SharedHero";
import SharedTabs from "@/components/SharedTabs";
import SharedGrid from "@/components/SharedGrid";

export const metadata = {
  title: "Familienleben – Smart Family Life by Lobbium",
};

export default function FamilienlebenPage() {
  return (
    <>
      <SharedHero
        title="Familienleben"
        subtitle="Organisation, Alltag & Inspirationen für ein entspanntes Familienleben."
      />

      <SharedTabs active="familie" />

      <SharedGrid category="familie" />
    </>
  );
}