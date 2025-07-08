import Layout from "@/components/layout/layout";
import UserManagement from "./Users";

export default function UsersLayout() {
  return (
    <Layout title="User Management" items={[{ label: "Home", href: "/" }]}>
      <UserManagement />
    </Layout>
  );
}
