import Layout from "@/components/layout/layout";
import { BasicComponent } from "./BasicPrint";

export default function PrintLayout() {
  return (
    <Layout
      title="Print Preview"
      items={[
        { label: "Home", href: "/" },
        { label: "Print List", href: "/printHistory" },
      ]}
    >
      <BasicComponent />
    </Layout>
  );
}
