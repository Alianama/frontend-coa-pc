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
import { Search, ArrowUpDown, EyeIcon } from "lucide-react";
import { Pagination } from "@/components/Product/Pagination";
import { useSelector, useDispatch } from "react-redux";
import { asyncGetAllPrint } from "@/store/print/action";

export default function PrintList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const dispatch = useDispatch();
  const { data: prints, pagination } = useSelector((state) => state.prints);

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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Print List</CardTitle>
            <CardDescription>View available print records.</CardDescription>
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

        {/* Results summary */}
        <div className="text-sm text-muted-foreground mb-4">
          Showing {pagination?.total || 0} prints
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
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
                  <TableHead>Color</TableHead>
                  <TableHead>Dispersibility</TableHead>
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
                  <TableHead className="text-right pr-6">Actions</TableHead>
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
                      <TableCell>{print.quantity}</TableCell>
                      <TableCell>{print.color}</TableCell>
                      <TableCell>{print.dispersibility}</TableCell>
                      <TableCell>
                        {new Date(print.printedDate).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button className="text-[10px]" variant="outline">
                          <EyeIcon /> Preview
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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
                  <SelectItem value="5">5 / page</SelectItem>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="20">20 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                  <SelectItem value="100">100 / page</SelectItem>
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
      </CardContent>
    </Card>
  );
}
