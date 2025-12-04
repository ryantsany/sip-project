import KelolaBuku from "@/components/kelolabuku";
import { AdminAuth } from "@/components/auth/admin-auth";

export default function KelolaBukuPage() {
  return (
    <AdminAuth>
      <KelolaBuku />
    </AdminAuth>
  );
}