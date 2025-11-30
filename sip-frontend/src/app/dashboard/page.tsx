import Dashboard from "@/components/dashboard"; 
import { SiswaAuth } from "@/components/auth/siswa-auth";

export default function DashboardPage() {
  return (
    <>
      <SiswaAuth>
        <Dashboard />
      </SiswaAuth>
    </>
  );
}