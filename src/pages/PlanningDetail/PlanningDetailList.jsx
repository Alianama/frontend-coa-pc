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
  asyncUpdatePlanningDetail,
  asyncPrintCoa,
} from "@/store/planningDetail/action";
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
import { Label } from "@/components/ui/label";

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
  const [updateFormData, setUpdateFormData] = useState({
    qty: "",
    lineNo: "",
    deltaL: "",
    deltaA: "",
    deltaB: "",
    mfr: "",
    dispersion: "",
    density: "",
    pelletLength: "",
    pelletDiameter: "",
    analysisDate: "",
    visualCheck: "",
    contamination: "",
    macaroni: "",
    moisture: "",
    carbonContent: "",
    foreignMatter: "",
    weightChips: "",
    intrinsicViscosity: "",
    ashContent: "",
    heatStability: "",
    lightFastness: "",
    granule: "",
    remark: "",
  });

  const handleConfirmPrint = async () => {
    if (planningDetail.header.id && printQuantity) {
      try {
        await dispatch(
          asyncPrintCoa(planningDetail.header.id, {
            quantity: Number(printQuantity),
          })
        );
        setIsPrintDialogOpen(false);
        setPrintQuantity("");
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
    setUpdateFormData({
      qty: item.qty || "",
      lineNo: item.lineNo || "",
      deltaL: item.deltaL || "",
      deltaA: item.deltaA || "",
      deltaB: item.deltaB || "",
      mfr: item.mfr || "",
      dispersion: item.dispersion || "",
      density: item.density || "",
      pelletLength: item.pelletLength || "",
      pelletDiameter: item.pelletDiameter || "",
      analysisDate: item.analysisDate
        ? new Date(item.analysisDate).toISOString().split("T")[0]
        : "",
      visualCheck: item.visualCheck || "",
      qcJudgment: item.qcJudgment || "",
      contamination: item.contamination || "",
      macaroni: item.macaroni || "",
      moisture: item.moisture || "",
      carbonContent: item.carbonContent || "",
      foreignMatter: item.foreignMatter || "",
      weightChips: item.weightChips || "",
      intrinsicViscosity: item.intrinsicViscosity || "",
      ashContent: item.ashContent || "",
      heatStability: item.heatStability || "",
      lightFastness: item.lightFastness || "",
      granule: item.granule || "",
      remark: item.remark || "",
    });
    setIsUpdateOpen(true);
  };

  const handleUpdate = async () => {
    if (editingItem) {
      try {
        const payload = {
          ...updateFormData,
          qty: updateFormData.qty === "" ? null : Number(updateFormData.qty),
          deltaL:
            updateFormData.deltaL === "" ? null : Number(updateFormData.deltaL),
          deltaA:
            updateFormData.deltaA === "" ? null : Number(updateFormData.deltaA),
          deltaB:
            updateFormData.deltaB === "" ? null : Number(updateFormData.deltaB),
          mfr: updateFormData.mfr === "" ? null : Number(updateFormData.mfr),
          dispersion:
            updateFormData.dispersion === ""
              ? null
              : Number(updateFormData.dispersion),
          density:
            updateFormData.density === ""
              ? null
              : Number(updateFormData.density),
          pelletLength:
            updateFormData.pelletLength === ""
              ? null
              : Number(updateFormData.pelletLength),
          pelletDiameter:
            updateFormData.pelletDiameter === ""
              ? null
              : Number(updateFormData.pelletDiameter),
          moisture:
            updateFormData.moisture === ""
              ? null
              : Number(updateFormData.moisture),
          carbonContent:
            updateFormData.carbonContent === ""
              ? null
              : Number(updateFormData.carbonContent),
          weightChips:
            updateFormData.weightChips === ""
              ? null
              : Number(updateFormData.weightChips),
          intrinsicViscosity:
            updateFormData.intrinsicViscosity === ""
              ? null
              : Number(updateFormData.intrinsicViscosity),
          ashContent:
            updateFormData.ashContent === ""
              ? null
              : Number(updateFormData.ashContent),
          contamination:
            updateFormData.contamination === ""
              ? null
              : Number(updateFormData.contamination),
          macaroni:
            updateFormData.macaroni === ""
              ? null
              : Number(updateFormData.macaroni),
          foreignMatter:
            updateFormData.foreignMatter === ""
              ? null
              : Number(updateFormData.foreignMatter),
          heatStability:
            updateFormData.heatStability === ""
              ? null
              : Number(updateFormData.heatStability),
          lightFastness:
            updateFormData.lightFastness === ""
              ? null
              : Number(updateFormData.lightFastness),
          granule:
            updateFormData.granule === ""
              ? null
              : Number(updateFormData.granule),
        };
        await dispatch(asyncUpdatePlanningDetail(editingItem.id, payload, lot));
        setIsUpdateOpen(false);
        setEditingItem(null);
        setUpdateFormData({
          qty: "",
          lineNo: "",
          deltaL: "",
          deltaA: "",
          deltaB: "",
          mfr: "",
          dispersion: "",
          density: "",
          pelletLength: "",
          pelletDiameter: "",
          analysisDate: "",
          visualCheck: "",
          qcJudgment: "",
          contamination: "",
          macaroni: "",
          moisture: "",
          carbonContent: "",
          foreignMatter: "",
          weightChips: "",
          intrinsicViscosity: "",
          ashContent: "",
          heatStability: "",
          lightFastness: "",
          granule: "",
          remark: "",
        });
      } catch (error) {
        console.error("Error updating planning detail:", error);
      }
    }
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStandardView = (item) => {
    // Konversi data item menjadi format yang sesuai dengan PlanningDetailStandardView

    setSelectedQcDetail(item.qcDetail);
    setIsStandardViewOpen(true);
  };

  console.log(planningDetail);

  useEffect(() => {
    dispatch(asyncGetPlanningDetailByLot(lot));
  }, [dispatch, lot]);

  // Definisi kolom
  const allColumns = [
    { key: "id", label: "No" },
    { key: "qty", label: "Qty Check" },
    { key: "creator", label: "Checker" },
    { key: "lineNo", label: "Line" },
    { key: "deltaL", label: "Δ L" },
    { key: "deltaA", label: "Δ A" },
    { key: "deltaB", label: "Δ B" },
    { key: "mfr", label: "MFR (gr/mnt)" },
    { key: "dispersion", label: "Dispersion" },
    { key: "density", label: "Density" },
    { key: "pellet", label: "Pallet (L x D)" },
    { key: "contamination", label: "Contamination" },
    { key: "macaroni", label: "Macaroni" },
    { key: "moisture", label: "Moisture (%)" },
    { key: "carbonContent", label: "Carbon Content (%)" },
    { key: "foreignMatter", label: "Foreign Matter" },
    { key: "weightChips", label: "Weight/Chips" },
    { key: "intrinsicViscosity", label: "Intrinsic Viscosity" },
    { key: "ashContent", label: "Ash Content (%)" },
    { key: "heatStability", label: "Heat Stability" },
    { key: "lightFastness", label: "Light Fastness" },
    { key: "granule", label: "Granule" },
    { key: "analysisDate", label: "Checked At" },
    { key: "visualCheck", label: "Visual Check" },
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
              quantityCheck={planningDetail?.totalQtyCheck}
              header={planningDetail.header}
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
            <Button onClick={() => navigate(`/planning/check/create/${lot}`)}>
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
                  <TableHead>Action</TableHead>
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
                          <TableCell key={col.key}>
                            {/* Render value sesuai key */}
                            {col.key === "id" && index + 1}
                            {col.key === "qty" &&
                              (item.qty != null
                                ? `${Number(item.qty).toFixed(2)} kg`
                                : "-")}
                            {col.key === "creator" && item.creator.fullName}
                            {col.key === "lineNo" && item.lineNo}
                            {col.key === "deltaL" && item.deltaL}
                            {col.key === "deltaA" && item.deltaA}
                            {col.key === "deltaB" && item.deltaB}
                            {col.key === "mfr" && item.mfr}
                            {col.key === "dispersion" && item.dispersion}
                            {col.key === "density" && item.density}
                            {col.key === "pellet" &&
                              `${item.pelletLength} x ${item.pelletDiameter} mm`}
                            {col.key === "contamination" && item.contamination}
                            {col.key === "macaroni" && item.macaroni}
                            {col.key === "moisture" && item.moisture}
                            {col.key === "carbonContent" && item.carbonContent}
                            {col.key === "foreignMatter" && item.foreignMatter}
                            {col.key === "weightChips" && item.weightChips}
                            {col.key === "intrinsicViscosity" &&
                              item.intrinsicViscosity}
                            {col.key === "ashContent" && item.ashContent}
                            {col.key === "heatStability" && item.heatStability}
                            {col.key === "lightFastness" && item.lightFastness}
                            {col.key === "granule" && item.granule}
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
                            {col.key === "qcJudgment" &&
                              (item.qcJudgment === "Passed" ? (
                                <Badge className="bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 px-1 py-0.5 text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />{" "}
                                  Passed
                                </Badge>
                              ) : item.qcJudgment === "NG" ? (
                                <Badge className="bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 px-1 py-0.5 text-xs">
                                  <AlertCircle className="w-3 h-3 mr-1" /> NG
                                </Badge>
                              ) : (
                                <span>-</span>
                              ))}
                            {col.key === "remark" && item.remark}
                          </TableCell>
                        ))}
                      <TableCell className="flex gap-3">
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
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleIsDeleteOpen(item.id)}
                              className="text-red-600"
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
                {/* <div className="text-sm text-muted-foreground">
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1} sampai{" "}
                  {Math.min(currentPage * itemsPerPage, filteredData.length)}{" "}
                  dari {filteredData.length} detail
                </div> */}
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
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Planning Detail</DialogTitle>
            <DialogDescription>
              Update data planning detail untuk lot {lot}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="qty">Quantity</Label>
                <Input
                  id="qty"
                  name="qty"
                  type="number"
                  step="0.01"
                  value={updateFormData.qty}
                  onChange={handleUpdateFormChange}
                  placeholder="Masukkan qty check"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lineNo">Line No</Label>
                <Input
                  id="lineNo"
                  name="lineNo"
                  value={updateFormData.lineNo}
                  onChange={handleUpdateFormChange}
                  placeholder="Masukkan line no"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="analysisDate">Analysis Date</Label>
                <Input
                  id="analysisDate"
                  name="analysisDate"
                  type="date"
                  value={updateFormData.analysisDate}
                  onChange={handleUpdateFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deltaL">ΔL</Label>
                <Input
                  id="deltaL"
                  name="deltaL"
                  type="number"
                  step="0.01"
                  value={updateFormData.deltaL}
                  onChange={handleUpdateFormChange}
                  placeholder="Masukkan delta L"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deltaA">Δa</Label>
                <Input
                  id="deltaA"
                  name="deltaA"
                  type="number"
                  step="0.01"
                  value={updateFormData.deltaA}
                  onChange={handleUpdateFormChange}
                  placeholder="Masukkan delta A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deltaB">Δb</Label>
                <Input
                  id="deltaB"
                  name="deltaB"
                  type="number"
                  step="0.01"
                  value={updateFormData.deltaB}
                  onChange={handleUpdateFormChange}
                  placeholder="Masukkan delta B"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="density">Density</Label>
                <Input
                  id="density"
                  name="density"
                  type="number"
                  step="0.01"
                  value={updateFormData.density}
                  onChange={handleUpdateFormChange}
                  placeholder="Masukkan density"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mfr">MFR</Label>
                <Input
                  id="mfr"
                  name="mfr"
                  type="number"
                  step="0.01"
                  value={updateFormData.mfr}
                  onChange={handleUpdateFormChange}
                  placeholder="Masukkan MFR"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dispersion">Dispersion</Label>
                <Input
                  id="dispersion"
                  name="dispersion"
                  type="number"
                  step="0.01"
                  value={updateFormData.dispersion}
                  onChange={handleUpdateFormChange}
                  placeholder="Masukkan dispersion"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contamination">Contamination</Label>
                <Input
                  id="contamination"
                  name="contamination"
                  value={updateFormData.contamination}
                  onChange={handleUpdateFormChange}
                  placeholder="Contamination"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="macaroni">Macaroni</Label>
                <Input
                  id="macaroni"
                  name="macaroni"
                  value={updateFormData.macaroni}
                  onChange={handleUpdateFormChange}
                  placeholder="Macaroni"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pelletLength">Pellet Length</Label>
                <Input
                  id="pelletLength"
                  name="pelletLength"
                  type="number"
                  step="0.01"
                  value={updateFormData.pelletLength}
                  onChange={handleUpdateFormChange}
                  placeholder="Masukkan pellet length"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pelletDiameter">Pellet Diameter</Label>
                <Input
                  id="pelletDiameter"
                  name="pelletDiameter"
                  type="number"
                  step="0.01"
                  value={updateFormData.pelletDiameter}
                  onChange={handleUpdateFormChange}
                  placeholder="Masukkan pellet diameter"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moisture">Moisture</Label>
                <Input
                  id="moisture"
                  name="moisture"
                  type="number"
                  step="0.01"
                  value={updateFormData.moisture}
                  onChange={handleUpdateFormChange}
                  placeholder="Moisture"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbonContent">Carbon Content</Label>
                <Input
                  id="carbonContent"
                  name="carbonContent"
                  type="number"
                  step="0.01"
                  value={updateFormData.carbonContent}
                  onChange={handleUpdateFormChange}
                  placeholder="Carbon Content"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="foreignMatter">Foreign Matter</Label>
                <Input
                  id="foreignMatter"
                  name="foreignMatter"
                  value={updateFormData.foreignMatter}
                  onChange={handleUpdateFormChange}
                  placeholder="Foreign Matter"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightChips">Weight Chips</Label>
                <Input
                  id="weightChips"
                  name="weightChips"
                  type="number"
                  step="0.01"
                  value={updateFormData.weightChips}
                  onChange={handleUpdateFormChange}
                  placeholder="Weight/Chips"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intrinsicViscosity">Intrinsic Viscosity</Label>
                <Input
                  id="intrinsicViscosity"
                  name="intrinsicViscosity"
                  type="number"
                  step="0.01"
                  value={updateFormData.intrinsicViscosity}
                  onChange={handleUpdateFormChange}
                  placeholder="Intrinsic Viscosity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ashContent">Ash Content</Label>
                <Input
                  id="ashContent"
                  name="ashContent"
                  type="number"
                  step="0.01"
                  value={updateFormData.ashContent}
                  onChange={handleUpdateFormChange}
                  placeholder="Ash Content"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heatStability">Heat Stability</Label>
                <Input
                  id="heatStability"
                  name="heatStability"
                  value={updateFormData.heatStability}
                  onChange={handleUpdateFormChange}
                  placeholder="Heat Stability"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lightFastness">Light Fastness</Label>
                <Input
                  id="lightFastness"
                  name="lightFastness"
                  value={updateFormData.lightFastness}
                  onChange={handleUpdateFormChange}
                  placeholder="Light Fastness"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="granule">Granule</Label>
                <Input
                  id="granule"
                  name="granule"
                  value={updateFormData.granule}
                  onChange={handleUpdateFormChange}
                  placeholder="Granule"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visualCheck">Visual Check</Label>
              <Select
                value={updateFormData.visualCheck}
                onValueChange={(value) =>
                  setUpdateFormData((prev) => ({ ...prev, visualCheck: value }))
                }
              >
                <SelectTrigger id="visualCheck">
                  <SelectValue placeholder="Pilih visual check" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ok">Ok</SelectItem>
                  <SelectItem value="Not Good">Not Good</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remark">Remark</Label>
              <Input
                id="remark"
                name="remark"
                value={updateFormData.remark}
                onChange={handleUpdateFormChange}
                placeholder="Remark"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          <div className="py-4">
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
