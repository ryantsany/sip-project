import KelolaKategori from "@/components/kelolakategori";
import { AdminAuth } from "@/components/auth/admin-auth";

export default function KelolaKategoriPage() {
  return (
    <AdminAuth>
      <KelolaKategori />
    </AdminAuth>
  );
}