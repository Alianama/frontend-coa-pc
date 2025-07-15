import Layout from "@/components/layout/layout";
import PlanningList from "./PlanningList";

export default function PlanningLayout() {
  return (
    <Layout title="Planning List" items={[{ label: "Home", href: "/" }]}>
      <title>QC | Planning List</title>
      <PlanningList />
    </Layout>
  );
}
