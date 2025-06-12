import COAListPage from "@/pages/Coa/CoaList";
import Layout from "@/components/layout/layout";

export default function COAListLayout() {
  return (
    <Layout
      title="COA List"
      items={[
        { label: "Home", href: "/" },
        // { label: "COA", href: "/coa" },
      ]}
    >
      <COAListPage />
    </Layout>
  );
}
