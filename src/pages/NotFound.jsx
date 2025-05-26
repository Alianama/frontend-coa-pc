import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          Kembali ke Dashboard
        </Button>
      </div>
    </div>
  );
}
