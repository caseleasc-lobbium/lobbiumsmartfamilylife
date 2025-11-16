import SharedHero from "../components/SharedHero";
import SharedTabs from "../components/SharedTabs";
import SharedGrid from "../components/SharedGrid";

export const metadata = {
  title: "Kinder & Bildung – Smart Family Life by Lobbium",
};

export default function KinderBildungPage() {
  return (
    <>
      <SharedHero
        title="Kinder & Bildung"
        subtitle="Spielerisch lernen, fördern und begleiten – Angebote & Ideen für Kinder."
      />

      <SharedTabs active="bildung" />

      <SharedGrid category="bildung" />
    </>
  );
}