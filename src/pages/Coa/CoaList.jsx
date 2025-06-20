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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileEdit,
  FilePlus,
  MoreHorizontal,
  Printer,
  // Printer,
  Search,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncGetCOA,
  asyncApproveCOA,
  asyncRemoveCoa,
} from "@/store/coa/action";
import { useNavigate } from "react-router-dom";
import { getStatusBadge } from "@/components/common/statusBedge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function COAListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoaId, setSelectedCoaId] = useState(null);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [selectedPrintCoa, setSelectedPrintCoa] = useState(null);
  const [printQuantity, setPrintQuantity] = useState("");
  const dispatch = useDispatch();
  const { coas = [], pagination = { totalPages: 0, totalItems: 0 } } =
    useSelector((state) => state.coa || {});
  const authUser = useSelector((state) => state.authUser);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(asyncGetCOA(currentPage, itemsPerPage, searchTerm));
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);

  const handleApprove = async (coaId) => {
    try {
      await dispatch(asyncApproveCOA(coaId));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteClick = (coaId) => {
    setSelectedCoaId(coaId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(asyncRemoveCoa(selectedCoaId));
      setDeleteDialogOpen(false);
      setSelectedCoaId(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(Number(newLimit));
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePrintClick = (coa) => {
    setSelectedPrintCoa(coa);
    setPrintQuantity(coa.quantity?.toString() || "0");
    setPrintDialogOpen(true);
  };

  const handleConfirmPrint = async () => {
    try {
      // TODO: Implement print functionality with quantity
      console.log(
        "Printing COA:",
        selectedPrintCoa.id,
        "with quantity:",
        printQuantity
      );
      setPrintDialogOpen(false);
      setSelectedPrintCoa(null);
      setPrintQuantity("");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6">
        <CardContent className="px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center gap-2 md:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama customer, produk, atau lot number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-[400px]"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Per halaman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => navigate("/COA/create")}
                className="ml-auto"
              >
                <FilePlus className="mr-2 h-4 w-4" />
                Create Planning
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("lotNumber")}
                >
                  Lot Number
                  {sortField === "lotNumber" && (
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
                  onClick={() => handleSort("costumerName")}
                >
                  Customer
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
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("quantity")}
                >
                  QTY Printed
                  {sortField === "quantity" && (
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
                  onClick={() => handleSort("color")}
                >
                  Color
                  {sortField === "color" && (
                    <ArrowUpDown
                      className={`ml-2 h-4 w-4 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              {/* <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("mfr")}
                >
                  MFR
                  {sortField === "mfr" && (
                    <ArrowUpDown
                      className={`ml-2 h-4 w-4 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead> */}
              {/* <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("density")}
                >
                  Density
                  {sortField === "density" && (
                    <ArrowUpDown
                      className={`ml-2 h-4 w-4 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead> */}
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Created Date
                  {sortField === "createdAt" && (
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
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortField === "status" && (
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
                  onClick={() => handleSort("creator.fullName")}
                >
                  Created By
                  {sortField === "creator.fullName" && (
                    <ArrowUpDown
                      className={`ml-2 h-4 w-4 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </TableHead>
              <TableHead className="pl-10">Action Button</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(coas) && coas.length > 0 ? (
              coas
                .sort((a, b) => {
                  if (!sortField) return 0;

                  let aValue = a;
                  let bValue = b;

                  // Handle nested properties
                  if (sortField.includes(".")) {
                    const [parent, child] = sortField.split(".");
                    aValue = a[parent]?.[child];
                    bValue = b[parent]?.[child];
                  } else {
                    aValue = a[sortField];
                    bValue = b[sortField];
                  }

                  if (sortField === "createdAt") {
                    return sortDirection === "asc"
                      ? new Date(aValue) - new Date(bValue)
                      : new Date(bValue) - new Date(aValue);
                  }

                  if (
                    typeof aValue === "string" &&
                    typeof bValue === "string"
                  ) {
                    return sortDirection === "asc"
                      ? aValue.localeCompare(bValue)
                      : bValue.localeCompare(aValue);
                  }

                  return sortDirection === "asc"
                    ? aValue - bValue
                    : bValue - aValue;
                })
                .map((coa) => (
                  <TableRow key={coa.id}>
                    <TableCell
                      onClick={() => navigate(`/coa/detail/${coa.id}`)}
                      className="font-bold hover:text-green-500 cursor-pointer hover:underline"
                    >
                      {coa.lotNumber}
                    </TableCell>
                    <TableCell>{coa.costumerName}</TableCell>
                    <TableCell>{coa.productName}</TableCell>
                    <TableCell>{coa.quantity ? coa.quantity : 0} kg</TableCell>
                    <TableCell>{coa.color}</TableCell>
                    {/* <TableCell>{coa.mfr}</TableCell>
                    <TableCell>{coa.density}</TableCell> */}
                    <TableCell>
                      {new Date(coa.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(coa.status)}</TableCell>
                    <TableCell> {coa?.creator?.fullName}</TableCell>
                    <TableCell className="pl-10 gap-1 flex">
                      {coa.status === "need_approval" &&
                        coa.approvedBy === null &&
                        (authUser?.role?.name === "SUPER_ADMIN" ||
                          authUser?.role?.name === "ADMIN") && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-[10px] hover:bg-green-500 bg-transparent"
                              >
                                <Check className="h-3 w-3" />
                                <h1>Approve</h1>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-secondary">
                              <DialogHeader>
                                <DialogTitle>Confirm Approval COA</DialogTitle>
                              </DialogHeader>
                              <DialogDescription>
                                Are you sure you want to approve this COA?
                              </DialogDescription>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                  onClick={() => {
                                    handleApprove(coa.id);
                                    document
                                      .querySelector(
                                        'button[aria-label="Close"]'
                                      )
                                      .click();
                                  }}
                                >
                                  Approve
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

                      {coa?.status === "approved" ||
                      coa?.status === "printed" ? (
                        <Button
                          variant="outline"
                          className="text-[10px]"
                          onClick={() => handlePrintClick(coa)}
                        >
                          <Printer className="h-3 w-3 mr-1" />
                          {coa.status === "printed" ? "Reprint" : "Print"}
                        </Button>
                      ) : null}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Button
                              onClick={() => navigate(`/COA/detail/${coa.id}`)}
                              className="w-full bg-transparent"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Detail
                            </Button>
                          </DropdownMenuItem>
                          {coa.status === "need_approval" && (
                            <DropdownMenuItem
                              onClick={() => navigate(`/COA/update/${coa.id}`)}
                            >
                              <Button className="bg-transparent w-full">
                                <FileEdit className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem>
                            <Button
                              className="bg-transparent w-full"
                              onClick={() => alert("halo")}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {(coa.status === "draft" ||
                            coa.status === "need_approval" ||
                            authUser?.role.name === "SUPER_ADMIN") && (
                            <DropdownMenuItem className="text-red-600">
                              <Button
                                className="bg-transparent w-full text-red-600"
                                onClick={() => handleDeleteClick(coa.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Tidak ada data COA
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Menampilkan {coas.length} dari {pagination.totalItems} data
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Halaman {currentPage} dari {pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-secondary">
          <DialogHeader>
            <DialogTitle>Confirm Delete COA</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this COA? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Confirmation Dialog */}
      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent className="bg-secondary">
          <DialogHeader>
            <DialogTitle>Confirm Print COA</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Please enter the quantity to print for this COA.
          </DialogDescription>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="quantity" className="text-right">
                Quantity
              </label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="quantity"
                  type="number"
                  value={printQuantity}
                  onChange={(e) => setPrintQuantity(e.target.value)}
                  className="col-span-2"
                  min="0"
                  step="0.01"
                />
                <span className="text-sm text-muted-foreground">kg</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleConfirmPrint}
              disabled={!printQuantity || Number(printQuantity) <= 0}
            >
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
