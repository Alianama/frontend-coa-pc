import Layout from "@/components/layout/layout";
import CustomerList from "./CustomerList";

export default function CustomerLayout() {
  return (
    <Layout title="Customer List" items={[{ label: "Home", href: "/" }]}>
      <CustomerList />
    </Layout>
  );
}
