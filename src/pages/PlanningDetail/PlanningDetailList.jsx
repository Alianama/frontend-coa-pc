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
import { Search, ArrowUpDown, CheckCircle2, AlertCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { asyncGetPlanningDetailByLot } from "@/store/planningDetail/action";
import { useParams, useNavigate } from "react-router-dom";
import DetailHeader from "./PlanningDetailHeader";

export default function PlanningDetailList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const dispatch = useDispatch();
  const planningDetail = useSelector((state) => state.planningDetail);
  const { lot } = useParams();

  console.log(planningDetail);

  useEffect(() => {
    dispatch(asyncGetPlanningDetailByLot(lot));
  }, [dispatch, lot]);

  // Filter, sort, dan paginasi data dari planningDetail.data
  const filteredData = useMemo(() => {
    if (!planningDetail.data) return [];
    return planningDetail.data
      .filter((item) => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        const visualCheckText = item.visualCheck === 1 ? "ok" : "not good";
        return (
          String(item.creator.fullName).toLowerCase().includes(search) ||
          String(item.qty).toLowerCase().includes(search) ||
          String(item.lineNo).toLowerCase().includes(search) ||
          visualCheckText.includes(search) ||
          (item.qcJudgment &&
            String(item.qcJudgment).toLowerCase().includes(search))
        );
      })
      .sort((a, b) => {
        if (!sortField) return 0;
        const aValue = a[sortField];
        const bValue = b[sortField];
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

  const navigate = useNavigate();

  return (
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
        </div>
        {planningDetail.header && (
          <DetailHeader
            quantityCheck={planningDetail?.totalQtyCheck}
            header={planningDetail.header}
          />
        )}
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-6 space-y-4">
          <Button onClick={() => navigate(`/planning/check/create/${lot}`)}>
            Add Checking
          </Button>
          <div className="flex flex-col md:flex-row gap-4">
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
          </div>
        </div>

        {/* Results summary */}
        <div className="text-sm text-muted-foreground mb-4">
          Menampilkan {filteredData.length} dari{" "}
          {planningDetail?.data?.length || 0} detail
        </div>

        {/* Table */}
        <div className="w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    ID
                    {sortField === "id" && (
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${
                          sortDirection === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead>Qty Check</TableHead>
                <TableHead>Checker</TableHead>
                <TableHead>Line</TableHead>
                <TableHead>Δ L</TableHead>
                <TableHead>Δ A</TableHead>
                <TableHead>Δ B</TableHead>
                <TableHead>Δ E</TableHead>
                <TableHead>{`MFR (gr/mnt)`}</TableHead>
                <TableHead>Dispersion</TableHead>
                <TableHead>Density</TableHead>
                <TableHead>{`Pallet (L x D)`}</TableHead>
                <TableHead>Checked At</TableHead>
                <TableHead>Visual Check</TableHead>
                <TableHead>QC Judgment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Tidak ada data detail.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {item.qty != null
                        ? `${Number(item.qty).toFixed(2)} kg`
                        : "-"}
                    </TableCell>
                    <TableCell className="truncate max-w-[120px]">
                      {item.creator.fullName}
                    </TableCell>
                    <TableCell>{item.lineNo}</TableCell>
                    <TableCell>{item.deltaL}</TableCell>
                    <TableCell>{item.deltaA}</TableCell>
                    <TableCell>{item.deltaB}</TableCell>
                    <TableCell>
                      {item.deltaE != null
                        ? Number(item.deltaE).toFixed(2)
                        : "-"}
                    </TableCell>
                    <TableCell>{item.mfr}</TableCell>
                    <TableCell>{item.dispersion}</TableCell>
                    <TableCell>{item.density}</TableCell>
                    <TableCell>
                      {item.pelletLength} x {item.pelletDiameter} mm
                    </TableCell>

                    <TableCell>
                      {item.analysisDate
                        ? new Date(item.analysisDate).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {item.visualCheck === "Ok" ? (
                        <Badge className="bg-green-100 text-green-800 border border-green-300 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 mr-1" /> OK
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 mr-1" /> Not Good
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="truncate max-w-[120px]">
                      {item.qcJudgment}
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
              <div className="text-sm text-muted-foreground">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} sampai{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} dari{" "}
                {filteredData.length} detail
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
                  <SelectItem value="5">5 / page</SelectItem>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="20">20 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Pagination komponen jika ada */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
