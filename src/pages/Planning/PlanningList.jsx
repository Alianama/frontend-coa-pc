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
import { asyncGetPlanning, asyncRemovePlanning } from "@/store/planning/action";
import { useNavigate } from "react-router-dom";
import {
  FilePlus,
  Search,
  Trash2,
  FileEdit,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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

  useEffect(() => {
    fetchData(page, limit, searchTerm);
    // eslint-disable-next-line
  }, [page, limit]);

  useEffect(() => {
    // Reset ke page 1 saat search berubah
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
                      <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
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
                  <TableCell>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        navigate(`/planning/check/${planning.lotNumber}`)
                      }
                      className="mr-2"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        navigate(`/planning/update/${planning.id}`)
                      }
                      className="mr-2"
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Dialog
                      open={
                        deleteDialogOpen && selectedPlanningId === planning.id
                      }
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedPlanningId(planning.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-2 w-2" />
                        </Button>
                      </DialogTrigger>
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
    </div>
  );
}
