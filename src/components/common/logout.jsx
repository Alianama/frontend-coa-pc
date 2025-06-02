import { useDispatch } from "react-redux";
import { asyncUnsetAuthUser } from "@/store/authUser/action";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Logout({ logoutIsOpen, setLogoutIsOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(asyncUnsetAuthUser());
    navigate("/login");
  };

  return (
    <Dialog open={logoutIsOpen} onOpenChange={setLogoutIsOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Konfirmasi Logout</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin keluar dari aplikasi?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setLogoutIsOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleLogout}>Ya, Logout</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
