import { AdminAuth } from "@/components/auth/admin-auth";
import DashAdmin from "@/components/dashadmin";

export default function AdminDashboardPage() {
  return <>
    <AdminAuth>
      <DashAdmin />
    </AdminAuth>
  </>;
}