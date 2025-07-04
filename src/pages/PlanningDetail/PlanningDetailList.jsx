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
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Trash,
  Edit,
  Eye,
  MoreHorizontal,
  RotateCcw,
  PrinterIcon,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  asyncGetPlanningDetailByLot,
  asyncDeletePlanningDetail,
} from "@/store/planningDetail/action";
import { asyncPrintCoa } from "@/store/print/action";
import { useParams, useNavigate } from "react-router-dom";
import DetailHeader from "./PlanningDetailHeader";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PlanningDetailStandardView from "./PlanningDetailStandardView";
import PlanningDetailUpdateDialog from "./PlanningDetailUpdateDialog";
import { asyncGetCustomer } from "@/store/customer/action";

export default function PlanningDetailList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const dispatch = useDispatch();
  const planningDetail = useSelector((state) => state.planningDetail);
  const { lot } = useParams();
  const [isDeletOpen, setIsDeleteOpen] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isStandardViewOpen, setIsStandardViewOpen] = useState(false);
  const [selectedQcDetail, setSelectedQcDetail] = useState([]);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [printQuantity, setPrintQuantity] = useState("");
  const [printRemarks, setPrintRemarks] = useState("");

  useEffect(() => {
    dispatch(asyncGetPlanningDetailByLot(lot));
    dispatch(asyncGetCustomer());
  }, [dispatch, lot]);

  const handleConfirmPrint = async () => {
    if (planningDetail.header.id && printQuantity) {
      try {
        await dispatch(
          asyncPrintCoa(planningDetail.header.id, printQuantity, printRemarks)
        );
        setIsPrintDialogOpen(false);
        setPrintQuantity("");
        setPrintRemarks("");
      } catch (error) {
        console.error("Error printing COA:", error);
      }
    }
  };

  const handleIsDeleteOpen = (id) => {
    setIsDeleteOpen(!isDeletOpen);
    setDeletedId(id);
  };

  const handleDelete = async () => {
    if (deletedId) {
      try {
        await dispatch(asyncDeletePlanningDetail(deletedId, lot));
        setIsDeleteOpen(false);
        setDeletedId(null);
      } catch (error) {
        console.error("Error deleting planning detail:", error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsUpdateOpen(true);
  };

  const handleStandardView = (item) => {
    // Konversi data item menjadi format yang sesuai dengan PlanningDetailStandardView

    setSelectedQcDetail(item.qcDetail);
    setIsStandardViewOpen(true);
  };

  console.log(planningDetail);

  // Definisi kolom
  const allColumns = [
    { key: "id", label: "No" },
    { key: "qty", label: "Qty Check" },
    { key: "creator", label: "Checker" },
    { key: "lineNo", label: "Line" },
    { key: "tintDeltaL", label: "Tint ΔL" },
    { key: "tintDeltaA", label: "Tint Δa" },
    { key: "tintDeltaB", label: "Tint Δb" },
    { key: "tintDeltaE", label: "Tint ΔE" },
    { key: "colorDeltaL", label: "Color ΔL" },
    { key: "colorDeltaA", label: "Color Δa" },
    { key: "colorDeltaB", label: "Color Δb" },
    { key: "colorDeltaE", label: "Color ΔE" },
    { key: "deltaP", label: "ΔP" },
    { key: "mfr", label: "MFR (gr/mnt)" },
    { key: "dispersibility", label: "Dispersibility" },
    { key: "density", label: "Density" },
    { key: "pellet", label: "Pallet (L x D)" },
    { key: "contamination", label: "Contamination" },
    { key: "macaroni", label: "Macaroni" },
    { key: "moisture", label: "Moisture (%)" },
    { key: "carbonContent", label: "Carbon Content (%)" },
    { key: "foreignMatter", label: "Foreign Matter" },
    { key: "weightOfChips", label: "Weight Of Chips" },
    { key: "intrinsicViscosity", label: "Intrinsic Viscosity" },
    { key: "ashContent", label: "Ash Content (%)" },
    { key: "heatStability", label: "Heat Stability" },
    { key: "lightFastness", label: "Light Fastness" },
    { key: "granule", label: "Granule" },
    { key: "caCO3", label: "CaCO3" },
    { key: "odor", label: "Odor" },
    { key: "nucleatingAgent", label: "Nucleating Agent" },
    { key: "hals", label: "Hals" },
    { key: "hiding", label: "Hiding" },
    { key: "analysisDate", label: "Checked At" },
    { key: "visualCheck", label: "Visual Check" },
    { key: "colorCheck", label: "Color Check" },
    { key: "qcJudgment", label: "QC Judgment" },
    { key: "remark", label: "Remark" },
  ];

  // Inisialisasi visibleColumns dengan default
  const [visibleColumns, setVisibleColumns] = useState(
    allColumns.map((col) => col.key)
  );

  // Filter, sort, dan paginasi data dari planningDetail.data
  const filteredData = useMemo(() => {
    if (!planningDetail.data) return [];
    return planningDetail.data
      .filter((item) => {
        // Filter global
        if (searchTerm) {
          const search = searchTerm.toLowerCase();
          const visualCheckText = item.visualCheck === 1 ? "ok" : "not good";
          if (
            String(item.creator.fullName).toLowerCase().includes(search) ||
            String(item.qty).toLowerCase().includes(search) ||
            String(item.lineNo).toLowerCase().includes(search) ||
            visualCheckText.includes(search) ||
            (item.qcJudgment &&
              String(item.qcJudgment).toLowerCase().includes(search))
          ) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (!sortField) return 0;
        let aValue = a[sortField];
        let bValue = b[sortField];
        // Penyesuaian untuk kolom khusus
        if (sortField === "creator") {
          aValue = a.creator.fullName;
          bValue = b.creator.fullName;
        }
        if (sortField === "pellet") {
          aValue = `${a.pelletLength} x ${a.pelletDiameter}`;
          bValue = `${b.pelletLength} x ${b.pelletDiameter}`;
        }
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      });
  }, [planningDetail.data, searchTerm, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
    setSortField("id");
    setSortDirection("asc");
    setCurrentPage(1);
  };

  const resetColumns = () => {
    location.reload();
  };

  const navigate = useNavigate();

  // updateVisibleColumns hanya update state
  const updateVisibleColumns = (newColumns) => {
    setVisibleColumns(newColumns);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                Planning Checking List
              </CardTitle>
              <CardDescription>
                List checking list berdasarkan lot number.
              </CardDescription>
              {/* Tampilkan header dan totalQtyCheck dari redux */}
            </div>
            <Button
              onClick={() => setIsPrintDialogOpen(true)}
              className="bg-green-500 text-white hover:bg-green-800"
            >
              <PrinterIcon />
              Print
            </Button>
          </div>
          {planningDetail.header && (
            <DetailHeader
              quantityPrinted={planningDetail?.totalQtyPrinted}
              quantityCheck={planningDetail?.totalQtyCheck}
              header={planningDetail?.header}
            />
          )}
        </CardHeader>
        <CardContent>
          {/* Dropdown Pilih Kolom */}
          <div className="mb-4 flex gap-2 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Column
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {allColumns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns.includes(col.key)}
                    onCheckedChange={() => {
                      const newColumns = visibleColumns.includes(col.key)
                        ? visibleColumns.filter((k) => k !== col.key)
                        : [...visibleColumns, col.key];
                      updateVisibleColumns(newColumns);
                    }}
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={resetColumns}
              title="Reset Column & Reload"
            >
              <RotateCcw />
            </Button>
            {/* ... tombol Add Checking, search global, clear filter ... */}

            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari detail..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {searchTerm && (
              <Button variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
            )}
            <Button
              disabled={planningDetail?.header?.status === "close"}
              onClick={() => navigate(`/planning/check/create/${lot}`)}
            >
              Add Checking
            </Button>
          </div>

          {/* Results summary */}
          <div className="text-sm text-muted-foreground mb-4">
            Menampilkan {filteredData.length} dari{" "}
            {planningDetail?.data?.length || 0} detail
          </div>

          {/* Table dinamis */}
          <div className="w-full rounded-md border overflow-x-auto">
            <Table className="border-collapse w-full text-xs">
              <TableHeader>
                <TableRow>
                  {visibleColumns
                    .map((key) => allColumns.find((col) => col.key === key))
                    .filter(Boolean)
                    .map((col) => (
                      <TableHead
                        className="cursor-pointer border-1 border-gray-200 text-center"
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                      >
                        <span className="inline-flex items-center">
                          {col.label}
                          {sortField === col.key && (
                            <ArrowUpDown
                              className={`ml-1 h-3 w-3 ${
                                sortDirection === "desc" ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </span>
                      </TableHead>
                    ))}
                  <TableHead
                    key="Action"
                    className="sticky right-0 bg-white z-10  border-1 border-gray-200 text-center min-w-[120px] "
                  >
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumns.length}
                      className="h-16 text-center text-xs"
                    >
                      Tidak ada data detail.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      {visibleColumns
                        .map((key) => allColumns.find((col) => col.key === key))
                        .filter(Boolean)
                        .map((col) => (
                          <TableCell
                            className="border-1 border-gray-200 text-center"
                            key={col.key}
                          >
                            {/* Render value sesuai key */}
                            {col.key === "id" && index + 1}
                            {col.key === "qty" &&
                              (item.qty != null
                                ? `${Number(item.qty).toFixed(2)} kg`
                                : "-")}
                            {col.key === "creator" && item.creator.fullName}
                            {col.key === "lineNo" && item.lineNo}
                            {col.key === "tintDeltaL" && item.tintDeltaL}
                            {col.key === "tintDeltaA" && item.tintDeltaA}
                            {col.key === "tintDeltaB" && item.tintDeltaB}
                            {col.key === "tintDeltaE" &&
                              (item.tintDeltaE != null
                                ? Number(item.tintDeltaE).toFixed(2)
                                : "-")}
                            {col.key === "colorDeltaL" && item.colorDeltaL}
                            {col.key === "colorDeltaA" && item.colorDeltaA}
                            {col.key === "colorDeltaB" && item.colorDeltaB}
                            {col.key === "colorDeltaE" &&
                              (item.colorDeltaE != null
                                ? Number(item.colorDeltaE).toFixed(2)
                                : "-")}
                            {col.key === "deltaP" && item.deltaP}
                            {col.key === "mfr" && item.mfr}
                            {col.key === "dispersibility" &&
                              item.dispersibility}
                            {col.key === "density" && item.density}
                            {col.key === "pellet" &&
                              `${item.pelletLength} x ${item.pelletDiameter} mm`}
                            {col.key === "contamination" && item.contamination}
                            {col.key === "macaroni" && item.macaroni}
                            {col.key === "moisture" && item.moisture}
                            {col.key === "carbonContent" && item.carbonContent}
                            {col.key === "foreignMatter" && item.foreignMatter}
                            {col.key === "weightOfChips" && item.weightOfChips}
                            {col.key === "intrinsicViscosity" &&
                              item.intrinsicViscosity}
                            {col.key === "ashContent" && item.ashContent}
                            {col.key === "heatStability" && item.heatStability}
                            {col.key === "lightFastness" && item.lightFastness}
                            {col.key === "granule" && item.granule}
                            {col.key === "caCO3" && item.caCO3}
                            {col.key === "odor" && item.odor}
                            {col.key === "nucleatingAgent" &&
                              item.nucleatingAgent}
                            {col.key === "hals" && item.hals}
                            {col.key === "hiding" && item.hiding}
                            {col.key === "analysisDate" &&
                              (item.analysisDate
                                ? new Date(item.analysisDate).toLocaleString(
                                    "id-ID",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )
                                : "-")}
                            {col.key === "visualCheck" &&
                              (item.visualCheck === "Ok" ? (
                                <Badge className="bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 px-1 py-0.5 text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> OK
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 px-1 py-0.5 text-xs">
                                  <AlertCircle className="w-3 h-3 mr-1" /> NG
                                </Badge>
                              ))}
                            {col.key === "colorCheck" &&
                              (item.colorCheck === "Ok" ? (
                                <Badge className="bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 px-1 py-0.5 text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> OK
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 px-1 py-0.5 text-xs">
                                  <AlertCircle className="w-3 h-3 mr-1" /> NG
                                </Badge>
                              ))}
                            {col.key === "qcJudgment" &&
                              (item.qcJudgment === "Passed" ? (
                                <Badge className="bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 px-1 py-0.5 text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />{" "}
                                  Passed
                                </Badge>
                              ) : !item.qcJudgment ||
                                item.qcJudgment === "NG" ? (
                                <Badge className="bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 px-1 py-0.5 text-xs">
                                  <AlertCircle className="w-3 h-3 mr-1" /> NG
                                </Badge>
                              ) : (
                                <span>-</span>
                              ))}
                            {col.key === "remark" && item.remark}
                          </TableCell>
                        ))}
                      <TableCell className="sticky  border-b-1 border-gray-200 text-center right-0 flex gap-2 justify-center bg-white z-10 min-w-[120px] border-l">
                        <Button
                          variant="outline"
                          className="w-8 h-8"
                          onClick={() => handleStandardView(item)}
                          title="Lihat Detail Standar QC"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-8 h-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(item)}
                              disabled={
                                planningDetail?.header?.status === "close"
                              }
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleIsDeleteOpen(item.id)}
                              className="text-red-600"
                              disabled={
                                planningDetail?.header?.status === "close"
                              }
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
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
                    <SelectItem value="1">1 / page</SelectItem>
                    <SelectItem value="5">5 / page</SelectItem>
                    <SelectItem value="10">10 / page</SelectItem>
                    <SelectItem value="20">20 / page</SelectItem>
                    <SelectItem value="50">50 / page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {"<"}
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.ceil(filteredData.length / itemsPerPage) },
                    (_, i) => i + 1
                  )
                    .filter((page) => {
                      const totalPages = Math.ceil(
                        filteredData.length / itemsPerPage
                      );
                      if (totalPages <= 7) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (page >= currentPage - 1 && page <= currentPage + 1)
                        return true;
                      return false;
                    })
                    .map((page, index, array) => {
                      // Add ellipsis
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <span key={`ellipsis-${page}`} className="px-2">
                            ...
                          </span>
                        );
                      }

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8"
                        >
                          {page}
                        </Button>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredData.length / itemsPerPage)
                  }
                >
                  {">"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDeletOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure want delete this checking?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-5">
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <PlanningDetailUpdateDialog
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        editingItem={editingItem}
      />

      {/* Standard View Dialog */}
      <PlanningDetailStandardView
        open={isStandardViewOpen}
        onClose={() => setIsStandardViewOpen(false)}
        qcDetail={selectedQcDetail}
      />

      {/* Print COA Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Print Certificate of Analysis</DialogTitle>
            <DialogDescription>
              Masukkan jumlah (quantity) yang ingin Anda cetak untuk COA lot
              number <strong>{planningDetail?.header?.lotNumber}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <label htmlFor="quantity" className="text-sm font-medium">
              Quantity
            </label>
            <Input
              id="quantity"
              type="number"
              value={printQuantity}
              onChange={(e) => setPrintQuantity(e.target.value)}
              placeholder="Contoh: 10"
            />
          </div>
          <div className="pb-2">
            <label htmlFor="remarks" className="text-sm font-medium">
              Remarks
            </label>
            <Input
              id="remarks"
              type="text"
              value={printRemarks}
              onChange={(e) => setPrintRemarks(e.target.value)}
              placeholder="Catatan Print"
            />
          </div>
          <DialogFooter className="flex gap-5">
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
    </>
  );
}
