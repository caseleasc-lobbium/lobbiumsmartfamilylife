import SharedHero from "@/components/SharedHero";
import SharedTabs from "@/components/SharedTabs";
import SharedGrid from "@/components/SharedGrid";

export default function FinanzenSpartippsPage() {
  return (
    <div className="w-full flex flex-col items-center">

      <SharedHero
        title="Finanzen & Spartipps"
        subtitle="Täglich neue Wege Geld zu sparen, clever zu investieren und den Alltag günstiger zu gestalten."
      />

      <SharedTabs active="finanzen" />

      <SharedGrid category="finanzen" />

    </div>
  );
}