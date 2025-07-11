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
import {
  Search,
  ArrowUpDown,
  Eye,
  X,
  Check,
  Printer,
  RefreshCcwIcon,
} from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { Combobox } from "@/components/ui/combo-box";
import { addDays, isAfter, isBefore } from "date-fns";
import { asyncGetCustomer } from "@/store/customer/action";
import { asyncGetProduct } from "@/store/product/action";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

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
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const dispatch = useDispatch();
  const { data: prints, pagination } = useSelector((state) => state.prints);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(""); // "approve" atau "reject"
  const [selectedId, setSelectedId] = useState(null);
  const customers = useSelector((state) => state.customers);
  const { products } = useSelector((state) => state.products);
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterProduct, setFilterProduct] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState({ from: null, to: null });

  useEffect(() => {
    dispatch(asyncGetCustomer());
    dispatch(asyncGetProduct());
  }, [dispatch]);

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
    const safeDate =
      filterDate && typeof filterDate === "object"
        ? filterDate
        : { from: null, to: null };
    const from = safeDate?.from ?? null;
    const to = safeDate?.to ?? null;
    return [...prints]
      .filter((item) => {
        // Filter customer
        if (
          filterCustomer &&
          String(item.costumerName) !==
            customers?.find((c) => c.id.toString() === filterCustomer)?.name
        )
          return false;
        // Filter product
        if (
          filterProduct &&
          String(item.productName) !==
            products?.find((p) => p.id.toString() === filterProduct)
              ?.productName
        )
          return false;
        // Filter status
        if (filterStatus && item.status !== filterStatus) return false;
        // Filter date (printedDate)
        if (from && to) {
          const d = new Date(item.printedDate);
          if (isBefore(d, from) || isAfter(d, addDays(to, 1))) return false;
        }
        return true;
      })
      .sort((a, b) => {
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
  }, [
    prints,
    sortField,
    sortDirection,
    filterCustomer,
    filterProduct,
    filterStatus,
    filterDate,
    customers,
    products,
  ]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const resetAllFilters = () => {
    setSearchTerm("");
    setFilterCustomer("");
    setFilterProduct("");
    setFilterStatus("");
    setFilterDate({ from: null, to: null });
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
        {/* Search & Filters */}
        <div className="mb-2">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-wrap gap-2 w-full">
              {/* Search */}
              <div className="relative min-w-[120px] max-w-[200px] flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari..."
                  className="pl-8 h-8 text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Customer & Produk */}
              <Combobox
                items={customers?.map((customer) => ({
                  value: customer.id.toString(),
                  label:
                    customer.name.length > 22
                      ? customer.name.slice(0, 20) + "..."
                      : customer.name,
                  fullLabel: customer.name,
                }))}
                value={filterCustomer}
                onValueChange={setFilterCustomer}
                placeholder="Customer"
                searchPlaceholder="Cari customer..."
                emptyMessage="Customer tidak ditemukan."
                className="flex h-8 text-xs min-w-[150px] max-w-[200px]"
                renderItem={(item) => (
                  <span title={item.fullLabel || item.label}>{item.label}</span>
                )}
              />
              <Combobox
                items={products?.map((product) => ({
                  value: product.id.toString(),
                  label:
                    product.productName.length > 22
                      ? product.productName.slice(0, 20) + "..."
                      : product.productName,
                  fullLabel: product.productName,
                }))}
                value={filterProduct}
                onValueChange={setFilterProduct}
                placeholder="Produk"
                searchPlaceholder="Cari produk..."
                emptyMessage="Produk tidak ditemukan."
                className="flex h-8 text-xs min-w-[120px] max-w-[180px]"
                renderItem={(item) => (
                  <span title={item.fullLabel || item.label}>{item.label}</span>
                )}
              />
              {/* Status */}
              <div className="min-w-[120px] max-w-[160px]">
                <Select
                  value={filterStatus || "ALL"}
                  onValueChange={(v) => setFilterStatus(v === "ALL" ? "" : v)}
                >
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="REQUESTED">Requested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Tanggal Print */}
              <div className="min-w-[140px] max-w-[200px]">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-8 w-full text-xs justify-start"
                    >
                      {filterDate && filterDate.from && filterDate.to
                        ? `${filterDate.from.toLocaleDateString(
                            "id-ID"
                          )} - ${filterDate.to.toLocaleDateString("id-ID")}`
                        : "Tanggal Print"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="end">
                    <Calendar
                      mode="range"
                      selected={filterDate}
                      onSelect={setFilterDate}
                      className="border rounded-md"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* Reset */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={resetAllFilters}
                title="Reset Filter"
              >
                <RefreshCcwIcon />
              </Button>
            </div>
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
                    Customer Template
                    {sortField === "costumerName" && (
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[200px]">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("shippedToCustomerName")}
                  >
                    Shipped To{" "}
                    {sortField === "shippedToCustomerName" && (
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
                <TableHead className="text-right sticky right-0 bg-white z-10 min-w-[120px]">
                  Actions
                </TableHead>
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
                    <TableCell>
                      {print.shippedToCustomerName || "Same as Template"}
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
                    <TableCell className="sticky right-0 bg-white z-10 min-w-[120px]">
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
