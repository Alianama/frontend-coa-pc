import Layout from "@/components/layout/layout";
import PlanningDetailList from "./PlanningDetailList";

export default function PlanningDetailLayout() {
  return (
    <Layout
      title="Checking List"
      items={[
        { label: "Home", href: "/" },
        { label: "Planning", href: "/planning" },
      ]}
    >
      <PlanningDetailList />
    </Layout>
  );
}
