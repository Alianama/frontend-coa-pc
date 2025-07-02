import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncGetPlanning,
  asyncRemovePlanning,
  asyncReopenPlanning,
  asyncClosePlanning,
} from "@/store/planning/action";
import { useNavigate } from "react-router-dom";
import {
  FilePlus,
  Search,
  Trash2,
  FileEdit,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Check,
  Repeat,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PlanningList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const { plannings = [] } = useSelector((state) => state.planning || {});
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlanningId, setSelectedPlanningId] = useState(null);
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [selectedPlanning, setSelectedPlanning] = useState(null);
  const authUser = useSelector((state) => state.authUser);

  useEffect(() => {
    fetchData(page, limit, searchTerm);
    // eslint-disable-next-line
  }, [page, limit]);

  useEffect(() => {
    setPage(1);
    fetchData(1, limit, searchTerm);
    // eslint-disable-next-line
  }, [searchTerm]);

  const fetchData = async (page, limit, search) => {
    try {
      const res = await dispatch(asyncGetPlanning(page, limit, search));
      setTotalPages(res.pagination?.totalPages || 1);
    } catch {
      setTotalPages(1);
    }
  };

  const handleDelete = async () => {
    if (!selectedPlanningId) return;
    try {
      await dispatch(asyncRemovePlanning(selectedPlanningId));
      setDeleteDialogOpen(false);
      setSelectedPlanningId(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleReopenPlanning = async (id) => {
    try {
      await dispatch(asyncReopenPlanning(id));
      setReopenDialogOpen(false);
      setSelectedPlanning(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleClosePlanning = async (id) => {
    try {
      await dispatch(asyncClosePlanning(id));
      setCloseDialogOpen(false);
      setSelectedPlanning(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <Card className="mb-6">
        <CardContent className="px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center gap-2 md:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan lot number, resin, atau moulding..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-[400px]"
              />
            </div>
            <Button onClick={() => navigate("/planning/create")}>
              <FilePlus className="mr-2 h-4 w-4" />
              Tambah Planning
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>No</TableHead> */}
              <TableHead>Lot No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Resin</TableHead>
              <TableHead>Ratio</TableHead>
              <TableHead>Moulding</TableHead>
              <TableHead>Qty Planning</TableHead>
              <TableHead>Mfg Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plannings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Tidak ada data planning.
                </TableCell>
              </TableRow>
            ) : (
              plannings.map((planning) => (
                <TableRow className="cursor-pointer" key={planning.id_header}>
                  {/* <TableCell>{idx + 1}</TableCell> */}
                  <TableCell>{planning.lotNumber}</TableCell>
                  <TableCell>{planning?.customer?.name}</TableCell>
                  <TableCell>{planning?.product?.productName}</TableCell>
                  <TableCell>{planning.resin}</TableCell>
                  <TableCell>{planning.ratio}</TableCell>
                  <TableCell>{planning.moulding}</TableCell>
                  <TableCell>{planning.qtyPlanning} Kg</TableCell>
                  <TableCell>
                    {planning.mfgDate
                      ? new Date(planning.mfgDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    {planning.expiryDate
                      ? new Date(planning.expiryDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    {planning.status === "open" && (
                      <Badge className="bg-red-100 text-red-800 border border-red-300">
                        Open
                      </Badge>
                    )}
                    {planning.status === "progress" && (
                      <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">
                        Progress
                      </Badge>
                    )}
                    {planning.status === "close" && (
                      <Badge className="bg-green-100 text-green-800 border border-green-300">
                        Close
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-3">
                    <Button
                      variant="outline"
                      className="w-8 h-8"
                      onClick={() =>
                        navigate(`/planning/check/${planning.lotNumber}`)
                      }
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {planning.status === "close" &&
                      (authUser?.role?.name === "ADMIN" ||
                        authUser?.role?.name === "SUPER_ADMIN") && (
                        <Button
                          variant="outline"
                          className="w-8 h-8 hover:bg-green-500 hover:text-white"
                          onClick={() => {
                            setSelectedPlanning(planning);
                            setReopenDialogOpen(true);
                          }}
                          title="Re-Open Planning"
                        >
                          <Repeat className="w-4 h-4" />
                        </Button>
                      )}
                    {planning.status === "progress" &&
                      (authUser?.role?.name === "ADMIN" ||
                        authUser?.role?.name === "SUPER_ADMIN") && (
                        <Button
                          variant="outline"
                          className="w-8 h-8 hover:bg-red-500 hover:text-white"
                          onClick={() => {
                            setSelectedPlanning(planning);
                            setCloseDialogOpen(true);
                          }}
                          title="Close Planning"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-8 h-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/planning/update/${planning.id}`)
                          }
                        >
                          <FileEdit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPlanningId(planning.id);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog
                      open={
                        deleteDialogOpen && selectedPlanningId === planning.id
                      }
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Confirmation</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this planning{" "}
                            <strong>{planning.lotNumber}</strong>?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                          </DialogClose>
                          <Button variant="destructive" onClick={handleDelete}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <span>
            Page {page} of {totalPages}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <label className="mr-2">Limit:</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[5, 10, 20, 50, 100].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reopen Confirmation Dialog */}
      <Dialog open={reopenDialogOpen} onOpenChange={setReopenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Re-Open Planning Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to re-open planning{" "}
              <strong>{selectedPlanning?.lotNumber}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="default"
              onClick={() => handleReopenPlanning(selectedPlanning?.id)}
              className="bg-green-500 hover:bg-green-600"
            >
              Re-Open
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Confirmation Dialog */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Planning Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to close planning{" "}
              <strong>{selectedPlanning?.lotNumber}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => handleClosePlanning(selectedPlanning?.id)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
