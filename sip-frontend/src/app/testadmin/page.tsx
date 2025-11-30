import RiwayatPinjam from "@/components/riwayatpinjam";
import { AdminAuth } from "@/components/auth/admin-auth";

export default function TestAdminPage() {
  return (
    <>
      <AdminAuth>
        <RiwayatPinjam />
      </AdminAuth>
    </>
  );
}