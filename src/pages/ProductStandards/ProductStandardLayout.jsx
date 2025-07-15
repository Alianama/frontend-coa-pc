import Layout from "@/components/layout/layout";
import ProductStandard from "./ProductStandard";

export default function ProductStandardsLayout() {
  return (
    <Layout
      title="Product Standard"
      items={[
        { label: "Home", href: "/" },
        { label: "Product List", href: "/products" },
      ]}
    >
      <title>QC | Product Standard</title>
      <ProductStandard />
    </Layout>
  );
}
