import TaschengeldTool from "./TaschengeldTool";
import { generateMetadata as buildMeta } from "../../../lib/seo";

export const metadata = buildMeta({
  title: "Taschengeld-Rechner nach Alter",
  description:
    "Wie viel Taschengeld ist in welchem Alter sinnvoll? Der kostenlose Rechner gibt dir sofort eine Orientierungs-Empfehlung pro Woche oder Monat.",
  path: "/tools/taschengeld",
});

export default function Page() {
  return <TaschengeldTool />;
}
