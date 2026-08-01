import KindergeldTool from "./KindergeldTool";
import { generateMetadata as buildMeta } from "../../../lib/seo";

export const metadata = buildMeta({
  title: "Kindergeld & Familienleistungen-Checker",
  description:
    "Welche Familienleistungen stehen dir zu? Der kostenlose Checker zeigt in 1 Minute, worauf deine Familie Anspruch haben könnte – Kindergeld, Elterngeld, Kinderzuschlag, Wohngeld & mehr. Mit Links zu den offiziellen Stellen.",
  path: "/tools/kindergeld-checker",
});

export default function Page() {
  return <KindergeldTool />;
}
