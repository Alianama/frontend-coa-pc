import Layout from "@/components/layout/layout";
import PlanningDetailForm from "./PlanningDetailForm";
import { useParams } from "react-router-dom";

export default function PlanningDetailFormLayout() {
  const { lot } = useParams();
  return (
    <Layout
      title="Form Check Detail"
      items={[
        { label: "Home", href: "/" },
        { label: "Planning", href: "/planning" },
        { label: "Checking List", href: `/planning/check/${lot}` },
      ]}
    >
      <PlanningDetailForm />
    </Layout>
  );
}
