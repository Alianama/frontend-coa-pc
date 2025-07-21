import Layout from "@/components/layout/layout";
import UnderConstruction from "./UnderConstruction";

export default function UnderConstructionLayout() {
  return (
    <Layout title="Solo Developer" items={[{ label: "Home", href: "/" }]}>
      <title>Solo Developer</title>
      <UnderConstruction />
    </Layout>
  );
}
