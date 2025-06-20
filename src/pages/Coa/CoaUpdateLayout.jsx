import CoaUpdateForm from "./CoaUpdateForm";
import Layout from "@/components/layout/layout";

export default function COAUpdateLayout() {
  return (
    <Layout
      title="COA Update"
      items={[
        { label: "Home", href: "/" },
        { label: "COA List", href: "/coa" },
      ]}
    >
      <CoaUpdateForm />
    </Layout>
  );
}
