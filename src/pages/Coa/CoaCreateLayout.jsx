import CoaCreateInput from "./CoaCreateInput";
import Layout from "@/components/layout/layout";

export default function COACreateLayout() {
  return (
    <Layout
      title="COA Create"
      items={[
        { label: "Home", href: "/" },
        { label: "COA List", href: "/coa" },
      ]}
    >
      <CoaCreateInput />
    </Layout>
  );
}
