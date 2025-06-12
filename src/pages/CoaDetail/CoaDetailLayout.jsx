import Layout from "@/components/layout/layout";
import COADetail from "./CoaDetail";

export default function COADetailLayout() {
  return (
    <Layout
      title="COA Detail"
      items={[
        { label: "Home", href: "/" },
        { label: "COA List", href: "/coa" },
      ]}
    >
      <COADetail />
    </Layout>
  );
}
