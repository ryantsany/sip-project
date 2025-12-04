import KelolaUser from "@/components/kelolauser";
import { AdminAuth } from "@/components/auth/admin-auth";

export default function KelolaUserPage() {
  return (
    <AdminAuth>
      <KelolaUser />
    </AdminAuth>
  );
}