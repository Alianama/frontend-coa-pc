import Layout from "@/components/layout/layout";
import ColorTrendChart from "./TrendColor";

export default function ColorTrendLayout() {
  return (
    <Layout
      title="Trend Color"
      items={[
        { label: "Home", href: "/" },
        { label: "Product List", href: "/trend-list" },
      ]}
    >
      <ColorTrendChart />
    </Layout>
  );
}
