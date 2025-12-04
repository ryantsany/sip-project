import KelolaPinjaman from "@/components/kelolapinjaman";
import { AdminAuth } from "@/components/auth/admin-auth";

export default function KelolaPinjamanPage() {
  return (
    <AdminAuth>
      <KelolaPinjaman />
    </AdminAuth>
  );
}
