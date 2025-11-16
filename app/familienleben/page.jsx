import SharedHero from "@/components/SharedHero";
import SharedTabs from "@/components/SharedTabs";
import SharedGrid from "@/components/SharedGrid";

export default function FamilienlebenPage() {
  return (
    <div className="w-full flex flex-col items-center">

      <SharedHero
        title="Familienleben"
        subtitle="Tipps, Ideen und Tools für ein harmonisches, organisiertes und entspanntes Miteinander."
      />

      <SharedTabs active="familie" />

      <SharedGrid category="familie" />

    </div>
  );
}