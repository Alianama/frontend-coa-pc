import Layout from "@/components/layout/layout";
import PrintList from "./PrintList";

export default function PrintListLayout() {
  return (
    <Layout title="COA History" items={[{ label: "Home", href: "/" }]}>
      <PrintList />
    </Layout>
  );
}
