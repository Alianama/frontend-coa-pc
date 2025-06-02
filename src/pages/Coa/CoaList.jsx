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
  FileClock,
  FileEdit,
  FilePlus,
  MoreHorizontal,
  Printer,
  Search,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncGetCOA,
  asyncApproveCOA,
  asyncRequestApprovalCOA,
} from "@/store/coa/action";
import { useDebounce } from "@/hooks/useDebounce";
import { getFullNameById } from "@/utils/userUtils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getStatusBadge } from "@/components/common/statusBedge";
import CoaCreateDialog from "./CoaCreateDialog";

export default function COAListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const dispatch = useDispatch();
  const { coas = [], pagination = { totalPages: 0, totalItems: 0 } } =
    useSelector((state) => state.coa || {});
  const authUser = useSelector((state) => state.authUser);
  const allUsers = useSelector((state) => state.allUsers || []);
  const [createCoaIsOpen, setCreatCoaIsOpen] = useState(false);
  const navigate = useNavigate();

  console.log(authUser);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(asyncGetCOA(currentPage, itemsPerPage, debouncedSearch));
  }, [dispatch, currentPage, itemsPerPage, debouncedSearch]);

  const handleApprove = async (coaId) => {
    try {
      const response = await dispatch(asyncApproveCOA(coaId));
      toast.success(response.message || "COA berhasil disetujui");
    } catch (error) {
      toast.error(error.message || "Gagal menyetujui COA");
    }
  };

  const handleDeleteCoa = (coa_id, coa_status) => {
    if (coa_status === "approved") {
      toast.error("Can't delete, COA Already Approved!");
    } else {
      toast.success("anjay");
    }
  };

  const handleRequestApproval = async (coaId) => {
    try {
      const response = await dispatch(asyncRequestApprovalCOA(coaId));
      toast.success(response.message || "Request Approval berhasil");
    } catch (error) {
      toast.error(error.message || "Gagal Request Approval COA");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(Number(newLimit));
    setCurrentPage(1);
  };

  const handleCreateCoaIsOpen = () => {
    setCreatCoaIsOpen(true);
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
              <Button onClick={handleCreateCoaIsOpen} className="ml-auto">
                <FilePlus className="mr-2 h-4 w-4" />
                Create COA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <CoaCreateDialog
        createCoaIsOpen={createCoaIsOpen}
        setCreateCoaIsOpen={setCreatCoaIsOpen}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lot Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="pl-10">Action Button</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(coas) && coas.length > 0 ? (
              coas.map((coa) => (
                <TableRow key={coa.id}>
                  <TableCell className="font-medium">{coa.lotNumber}</TableCell>
                  <TableCell>{coa.costumerName}</TableCell>
                  <TableCell>{coa.productName}</TableCell>
                  <TableCell>
                    {new Date(coa.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(coa.status)}</TableCell>
                  <TableCell>
                    {getFullNameById(coa.createdBy, allUsers)}
                  </TableCell>
                  <TableCell className="pl-10">
                    <Button
                      onClick={() => navigate(`/COA/detail/${coa.id}`)}
                      className="text-[10px] bg-transparent"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>

                    {coa.status === "draft" &&
                      coa.approvedBy === null &&
                      authUser?.username === coa.issueBy && (
                        <Button
                          onClick={() => handleRequestApproval(coa.id)}
                          className="text-[10px] bg-transparent"
                        >
                          <FileClock className="h-3 w-3" />
                          <h1 className="">Request Approval</h1>
                        </Button>
                      )}

                    {coa.status === "need_approval" &&
                      coa.approvedBy === null &&
                      (authUser?.role?.name === "SUPER_ADMIN" ||
                        authUser?.role?.name === "ADMIN") && (
                        <Button
                          onClick={() => handleApprove(coa.id)}
                          className="text-[10px] bg-transparent"
                        >
                          <Check className="h-3 w-3" />
                          <h1 className="">Approve</h1>
                        </Button>
                      )}
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
                            className="bg-transparent"
                            onClick={() => alert("halo")}
                          >
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Button
                            disabled={!coa.approvedBy}
                            className="bg-transparent"
                            onClick={() => alert("halo")}
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                            {!coa.approvedBy && (
                              <p className="text-[8px] text-red ml-2">
                                Need Approved
                              </p>
                            )}
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Button
                            className="bg-transparent"
                            onClick={() => alert("halo")}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Button
                            // disabled={coa.status === "approved"}
                            className="bg-transparent text-red-600"
                            onClick={() => handleDeleteCoa(coa.id, coa.status)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </DropdownMenuItem>
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
    </motion.div>
  );
}
