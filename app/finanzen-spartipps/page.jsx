import SharedHero from "@/components/SharedHero";
import SharedTabs from "@/components/SharedTabs";
import SharedGrid from "@/components/SharedGrid";

export const metadata = {
  title: "Finanzen & Spartipps – Smart Family Life by Lobbium",
};

export default function FinanzenSpartippsPage() {
  return (
    <>
      <SharedHero
        title="Finanzen & Spartipps"
        subtitle="Clever sparen – mit smarten Finanzideen, Angeboten & Spartipps für deinen Alltag."
      />

      <SharedTabs active="finanzen" />

      <SharedGrid category="finanzen" />
    </>
  );
}