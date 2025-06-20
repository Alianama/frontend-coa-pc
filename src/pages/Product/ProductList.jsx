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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Search,
  ArrowUpDown,
} from "lucide-react";
import ProductDetailDialog from "@/components/Product/product-detail-dialog";
import ProductFormDialog from "@/components/Product/product-form-dialog";
import { Pagination } from "@/components/Product/Pagination";
import { useSelector, useDispatch } from "react-redux";
import {
  asyncAddProduct,
  asyncDeleteProduct,
  asyncGetProduct,
  asyncUpdateProduct,
} from "@/store/product/action";

export default function ProductList() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResin, setFilterResin] = useState("all");
  const [filterColor, setFilterColor] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        await dispatch(asyncGetProduct());
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [dispatch]);

  // Get unique values for filters
  const uniqueResins = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.resin)));
  }, [products]);

  const uniqueColors = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.color)));
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          searchTerm === "" ||
          product.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.resin.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesResin =
          filterResin === "all" || product.resin === filterResin;
        const matchesColor =
          filterColor === "all" || product.color === filterColor;

        return matchesSearch && matchesResin && matchesColor;
      })
      .sort((a, b) => {
        if (!sortField) return 0;

        const aValue = a[sortField];
        const bValue = b[sortField];

        if (sortField === "createdAt") {
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
    products,
    searchTerm,
    filterResin,
    filterColor,
    sortField,
    sortDirection,
  ]);

  // Rest of the code remains the same...
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterResin, filterColor]);

  const handleAddProductClick = () => {
    setSelectedProduct(null);
    setIsFormDialogOpen(true);
  };

  const handleEditProductClick = (product) => {
    setSelectedProduct(product);
    setIsFormDialogOpen(true);
  };

  const handleViewDetailClick = (product) => {
    setSelectedProduct(product);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await handleDeleteProduct(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteProduct = async (id) => {
    setIsLoading(true);
    try {
      await dispatch(asyncDeleteProduct(id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (product) => {
    setIsLoading(true);
    try {
      await dispatch(asyncAddProduct(product));
      setIsFormDialogOpen(false);
      setSelectedProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (product) => {
    setIsLoading(true);
    try {
      await dispatch(asyncUpdateProduct(selectedProduct.id, product));
      setIsFormDialogOpen(false);
      setSelectedProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async (product) => {
    if (selectedProduct) {
      await handleEditProduct(product);
    } else {
      await handleAddProduct(product);
    }
  };

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
    setFilterResin("all");
    setFilterColor("all");
    setSortField("createdAt");
    setSortDirection("desc");
    setCurrentPage(1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">
              Product Management
            </CardTitle>
            <CardDescription>
              Manage your plastic colorant products.
            </CardDescription>
          </div>
          <Button onClick={handleAddProductClick} disabled={isLoading}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterResin} onValueChange={setFilterResin}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Resin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Resins</SelectItem>
                  {uniqueResins.map((resin) => (
                    <SelectItem key={resin} value={resin}>
                      {resin}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterColor} onValueChange={setFilterColor}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colors</SelectItem>
                  {uniqueColors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchTerm ||
                filterResin !== "all" ||
                filterColor !== "all") && (
                <Button variant="outline" onClick={resetFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results summary */}
        <div className="text-sm text-muted-foreground mb-4">
          Showing {filteredProducts.length} of {products.length} products
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
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
                      onClick={() => handleSort("resin")}
                    >
                      Resin
                      {sortField === "resin" && (
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
                  <TableHead>Let Down Ratio</TableHead>
                  <TableHead>Cretaed Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.productName}
                      </TableCell>
                      <TableCell>{product.resin}</TableCell>
                      <TableCell>
                        <div className="">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: product.color.toLowerCase(),
                              border:
                                product.color.toLowerCase() === "white"
                                  ? "1px solid #e2e8f0"
                                  : "none",
                            }}
                          />
                          {product.color}
                        </div>
                      </TableCell>
                      <TableCell>{product.letDownRatio}</TableCell>
                      <TableCell>
                        {new Date(product.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewDetailClick(product)}
                            >
                              <Eye className="mr-2 h-4 w-4" /> View Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditProductClick(product)}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(product)}
                              className="text-red-600"
                              disabled={isLoading}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
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
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)}{" "}
                of {filteredProducts.length} entries
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </CardContent>

      <ProductDetailDialog
        product={selectedProduct}
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />

      <ProductFormDialog
        product={selectedProduct}
        isOpen={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSave={handleSaveProduct}
        isLoading={isLoading}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk{" "}
              <span className="font-semibold">
                {productToDelete?.productName}
              </span>{" "}
              secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
