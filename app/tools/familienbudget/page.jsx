import FamilienbudgetTool from "./FamilienbudgetTool";
import { generateMetadata as buildMeta } from "../../../lib/seo";

export const metadata = buildMeta({
  title: "Familienbudget-Rechner (50-30-20)",
  description:
    "Berechne mit der 50-30-20-Methode, wie viel deiner Familie für Notwendiges, Wünsche und Sparen bleibt. Kostenlos, ohne Anmeldung.",
  path: "/tools/familienbudget",
});

export default function Page() {
  return <FamilienbudgetTool />;
}
