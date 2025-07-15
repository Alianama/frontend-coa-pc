import Layout from "@/components/layout/layout";
import Report from "./Report";

export default function ReportLayout() {
  return (
    <Layout title="Report" items={[{ label: "Home", href: "/" }]}>
      <title>QC | Report Generator</title>
      <Report />
    </Layout>
  );
}
