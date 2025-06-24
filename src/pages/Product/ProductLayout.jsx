import Layout from "@/components/layout/layout";
import ProductList from "./ProductList";

export default function ProductsLayout() {
  return (
    <Layout title="Product List" items={[{ label: "Home", href: "/" }]}>
      <ProductList />
    </Layout>
  );
}
