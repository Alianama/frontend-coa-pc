import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpDown, Eye, X, Check, Printer } from "lucide-react";
import { Pagination } from "@/components/Product/Pagination";
import { useSelector, useDispatch } from "react-redux";
import {
  asyncGetAllPrint,
  asyncApprovePrintCoa,
  asyncRejectPrintCoa,
} from "@/store/print/action";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

// Komponen kecil untuk badge status
function StatusBadge({ status }) {
  const statusMap = {
    APPROVED: {
      text: "Approved",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    REJECTED: {
      text: "Rejected",
      bg: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },
    REQUESTED: {
      text: "Requested",
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
  };
  const { text, bg, dot } = statusMap[status] || statusMap.REQUESTED;
  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${bg}`}
    >
      <div className={`w-2 h-2 rounded-full mr-2 ${dot}`} />
      {text}
    </div>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

// Komponen kecil untuk tombol aksi
function ActionButtons({ onApprove, onReject, onView, onPrint, status }) {
  const authUser = useSelector((state) => state.authUser);
  const isAdmin =
    authUser?.role?.name === "ADMIN" || authUser?.role?.name === "SUPER_ADMIN";
  return (
    <div className="flex gap-2 justify-end">
      {isAdmin && status !== "APPROVED" && status !== "REJECTED" && (
        <Button
          className="w-8 h-8"
          variant="destructive"
          title="Reject"
          onClick={onReject}
        >
          <X />
        </Button>
      )}
      {isAdmin && status !== "REJECTED" && status !== "APPROVED" && (
        <Button
          className="w-8 h-8"
          variant="default"
          title="Approve"
          onClick={onApprove}
        >
          <Check />
        </Button>
      )}
      <Button
        variant="outline"
        className="w-8 h-8"
        title="View"
        onClick={onView}
      >
        <Eye className="w-4 h-4" />
      </Button>

      {status === "APPROVED" && (
        <Button
          className="w-8 h-8"
          variant="default"
          title="Print"
          onClick={onPrint}
        >
          <Printer />
        </Button>
      )}
    </div>
  );
}

ActionButtons.propTypes = {
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onPrint: PropTypes.func.isRequired,
};

export default function PrintList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const dispatch = useDispatch();
  const { data: prints, pagination } = useSelector((state) => state.prints);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(""); // "approve" atau "reject"
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchPrints = async () => {
      try {
        await dispatch(asyncGetAllPrint(currentPage, itemsPerPage, searchTerm));
      } catch (error) {
        console.error("Error fetching prints:", error);
      }
    };
    fetchPrints();
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);

  // Filter and sort prints
  const filteredPrints = useMemo(() => {
    if (!prints) return [];

    return [...prints].sort((a, b) => {
      if (!sortField) return 0;

      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortField === "createdAt" || sortField === "printedDate") {
        return sortDirection === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [prints, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortField("createdAt");
    setSortDirection("desc");
    setCurrentPage(1);
  };

  const openDialog = (type, id) => {
    setDialogType(type);
    setSelectedId(id);
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (dialogType === "approve") {
      dispatch(asyncApprovePrintCoa(selectedId));
    } else if (dialogType === "reject") {
      dispatch(asyncRejectPrintCoa(selectedId));
    }
    setDialogOpen(false);
  };

  const handleApprove = (id) => {
    openDialog("approve", id);
  };
  const handleReject = (id) => {
    openDialog("reject", id);
  };
  const handleView = (id) => {
    navigate(`/print/preview/${id}`);
  };
  const handlePrint = (id) => {
    navigate(`/print/print/${id}`);
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">COA List</CardTitle>
            <CardDescription>View available COA records.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prints..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <Button variant="outline" onClick={resetFilters}>
                Clear Filter
              </Button>
            )}
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          Showing {pagination?.total || 0} prints
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("costumerName")}
                  >
                    Customer Name
                    {sortField === "costumerName" && (
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("productName")}
                  >
                    Product Name
                    {sortField === "productName" && (
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead>Lot Number</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Responsible By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("printedDate")}
                  >
                    Print Date
                    {sortField === "printedDate" && (
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!filteredPrints.length ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No prints found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrints.map((print) => (
                  <TableRow key={print.id}>
                    <TableCell className="font-medium">
                      {print.costumerName}
                    </TableCell>
                    <TableCell>{print.productName}</TableCell>
                    <TableCell>{print.lotNumber}</TableCell>
                    <TableCell>{print.quantity} Kg</TableCell>
                    <TableCell>
                      {print.approvedByName || print.rejectedByName}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={print.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(print.printedDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{print.remarks}</TableCell>
                    <TableCell>
                      <ActionButtons
                        onApprove={() => handleApprove(print.id)}
                        onReject={() => handleReject(print.id)}
                        onView={() => handleView(print.id)}
                        onPrint={() => handlePrint(print.id)}
                        status={print.status}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {pagination.total} entries
              </div>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 5, 10, 20, 50, 100].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogType === "approve"
                  ? "Konfirmasi Approve"
                  : "Konfirmasi Reject"}
              </DialogTitle>
            </DialogHeader>
            <div>
              {dialogType === "approve"
                ? "Apakah Anda yakin ingin APPROVE data ini?"
                : "Apakah Anda yakin ingin REJECT data ini?"}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button
                variant={dialogType === "approve" ? "default" : "destructive"}
                onClick={handleDialogConfirm}
              >
                Ya
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
