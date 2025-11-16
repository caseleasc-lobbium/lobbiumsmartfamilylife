import SharedHero from "@/components/SharedHero";
import SharedTabs from "@/components/SharedTabs";
import SharedGrid from "@/components/SharedGrid";

export default function LifestylePage() {
  return (
    <div className="w-full flex flex-col items-center">

      <SharedHero
        title="Lifestyle"
        subtitle="Mode, Reisen, Beauty, Ernährung, Fitness und moderne Inspirationen für deinen Alltag."
      />

      <SharedTabs active="lifestyle" />

      <SharedGrid category="lifestyle" />

    </div>
  );
}