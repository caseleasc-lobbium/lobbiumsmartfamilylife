import SharedHero from "@/components/SharedHero";
import SharedTabs from "@/components/SharedTabs";
import SharedGrid from "@/components/SharedGrid";

export default function KinderBildungPage() {
  return (
    <div className="w-full flex flex-col items-center">

      <SharedHero
        title="Kinder & Bildung"
        subtitle="Lernen, Kreativität, Förderung – inspirationen für Kinder im modernen Familienalltag."
      />

      <SharedTabs active="bildung" />

      <SharedGrid category="bildung" />

    </div>
  );
}