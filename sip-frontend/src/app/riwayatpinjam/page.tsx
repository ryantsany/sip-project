import RiwayatPinjam from "@/components/riwayatpinjam";
import { SiswaAuth } from "@/components/auth/siswa-auth";

export default function RiwayatPage() {
  return (
    <>
      <SiswaAuth>
        <RiwayatPinjam />
      </SiswaAuth>
    </>
  );
}