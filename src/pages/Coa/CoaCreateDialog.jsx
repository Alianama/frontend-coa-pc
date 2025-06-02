import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";

export default function CoaCreateDialog({
  createCoaIsOpen,
  setCreateCoaIsOpen,
}) {
  const navigate = useNavigate();

  return (
    <Dialog open={createCoaIsOpen} onOpenChange={setCreateCoaIsOpen}>
      <DialogContent className="bg-secondary">
        <DialogHeader>
          <DialogTitle>Create COA</DialogTitle>
          <DialogDescription>Input COA Data to create COA</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-center items-center min-h-60 gap-5">
          <div className="h-1/2 border-2 w-full justify-center items-center flex rounded-2xl">
            <h1>Drag Here</h1>
          </div>
          <h1>Or</h1>
          <div>
            <Button onClick={() => navigate("/COA/create")}>
              Input Manual
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
