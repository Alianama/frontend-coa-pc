import Layout from "@/components/layout/layout";
import PlasticColorantDashboard from "./ProductList";

export default function ProductsLayout() {
  return (
    <Layout title="Product List" items={[{ label: "Home", href: "/" }]}>
      <PlasticColorantDashboard />
    </Layout>
  );
}
