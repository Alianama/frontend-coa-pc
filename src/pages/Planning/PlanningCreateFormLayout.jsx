import Layout from "@/components/layout/layout";
import PlanningCreateForm from "./PlanningCreateForm";

export default function PlanningCreateLayout() {
  return (
    <Layout
      title="Planning Form"
      items={[
        { label: "Home", href: "/" },
        { label: "Planning", href: "/planning" },
      ]}
    >
      <PlanningCreateForm />
    </Layout>
  );
}
