import GantiPassword from "@/components/gantipassword"; 
import { SiswaAuth } from "@/components/auth/siswa-auth";

export default function GantiPasswordPage() {
  return (
    <>
      <SiswaAuth>
        <GantiPassword />
      </SiswaAuth>
    </>
  );
}