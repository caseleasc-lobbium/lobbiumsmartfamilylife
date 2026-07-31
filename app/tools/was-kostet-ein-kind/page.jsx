import KostenKindTool from "./KostenKindTool";
import { generateMetadata as buildMeta } from "../../../lib/seo";

export const metadata = buildMeta({
  title: "Was kostet ein Kind? – Rechner",
  description:
    "Was kostet ein Kind bis zum 18. Geburtstag? Der kostenlose Rechner schätzt die Kosten pro Monat, Jahr und gesamt – auf Basis von Durchschnittswerten.",
  path: "/tools/was-kostet-ein-kind",
});

export default function Page() {
  return <KostenKindTool />;
}
