import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { asyncChangePassword } from "@/store/authUser/action";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Tambahkan style animasi shake
const style = `
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
  100% { transform: translateX(0); }
}
.animate-shake {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}
.border-red-500 {
  border-color: #ef4444 !important;
}
`;

export default function ChangePasswordDialog({ open, onOpenChange }) {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errorField, setErrorField] = useState({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    let errors = {};
    let shakeFields = {};
    if (!currentPass) {
      errors.current = true;
      shakeFields.current = true;
    }
    if (!newPass) {
      errors.new = true;
      shakeFields.new = true;
    }
    if (!confirmPass) {
      errors.confirm = true;
      shakeFields.confirm = true;
    }
    if (newPass && confirmPass && newPass !== confirmPass) {
      errors.confirm = true;
      shakeFields.confirm = true;
      toast.error("Password baru dan konfirmasi tidak sama!");
    }
    if (Object.keys(errors).length > 0) {
      setErrorField(errors);
      setTimeout(() => setErrorField({}), 500);
      if (!Object.keys(errors).includes("confirm")) {
        toast.error("Semua field harus diisi!");
      }
      return;
    }
    setErrorField({});
    try {
      await dispatch(
        asyncChangePassword({ oldPassword: currentPass, newPassword: newPass })
      );
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
      onOpenChange(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <style>{style}</style>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ganti Password</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder="Password saat ini"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className={`pr-10 ${
                  errorField.current ? "border-red-500 animate-shake" : ""
                }`}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowCurrent((v) => !v)}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                placeholder="Password baru"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className={`pr-10 ${
                  errorField.new ? "border-red-500 animate-shake" : ""
                }`}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowNew((v) => !v)}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Konfirmasi password baru"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className={`pr-10 ${
                  errorField.confirm ? "border-red-500 animate-shake" : ""
                }`}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

ChangePasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
};
