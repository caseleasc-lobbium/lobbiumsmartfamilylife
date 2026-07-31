import SpartypTool from "./SpartypTool";
import { generateMetadata as buildMeta } from "../../../lib/seo";

export const metadata = buildMeta({
  title: "Welcher Spar-Typ bist du? – Test",
  description:
    "5 Fragen, dein persönlicher Spar-Typ: Finde heraus, wie du und deine Familie am besten spart – mit Tipps, die wirklich zu dir passen.",
  path: "/tools/spartyp-test",
});

export default function Page() {
  return <SpartypTool />;
}
