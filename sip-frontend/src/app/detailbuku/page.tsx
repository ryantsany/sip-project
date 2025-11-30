import DetailBuku from "@/components/detailbuku";
import { SiswaAuth } from "@/components/auth/siswa-auth";

export default function DetailBukuPage() {
  return (
    <>
      <SiswaAuth>
        <DetailBuku />
      </SiswaAuth>
    </>
  );
}