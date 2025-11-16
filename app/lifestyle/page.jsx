import SharedHero from "../components/SharedHero";
import SharedTabs from "../components/SharedTabs";
import SharedGrid from "../components/SharedGrid";

export const metadata = {
  title: "Lifestyle – Smart Family Life by Lobbium",
};

export default function LifestylePage() {
  return (
    <>
      <SharedHero
        title="Lifestyle"
        subtitle="Dein smarter Begleiter für moderne Familien – Haushalt, Shopping & Lebensstil."
      />

      <SharedTabs active="lifestyle" />

      <SharedGrid category="lifestyle" />
    </>
  );
}