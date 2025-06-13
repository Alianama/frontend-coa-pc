"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import ProductForm from "@/components/Product/ProductForm";
import ProductDetails from "@/components/Product/ProductDetails";

const initialData = [
  {
    id: 1,
    productName: "Plastic Colorant Red",
    resin: "PP",
    letDownRatio: "1:100",
    color: "Red",
    mfr: 2.5,
    density: 0.95,
    heatStability: 280,
    lightFastness: 7,
  },
  {
    id: 2,
    productName: "Plastic Colorant Yellow",
    resin: "PP",
    letDownRatio: "1:100",
    color: "Yellow",
    mfr: 2.5,
    density: 0.95,
    heatStability: 280,
    lightFastness: 7,
  },
];

export default function ProductList() {
  const [products, setProducts] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResin, setFilterResin] = useState("all");
  const [filterColor, setFilterColor] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({});
  const itemsPerPage = 10;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.resin.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesResin =
        filterResin === "all" || product.resin === filterResin;
      const matchesColor =
        filterColor === "all" || product.color === filterColor;
      return matchesSearch && matchesResin && matchesColor;
    });
  }, [products, searchTerm, filterResin, filterColor]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const uniqueResins = [...new Set(products.map((p) => p.resin))];
  const uniqueColors = [...new Set(products.map((p) => p.color))];

  const handleAdd = () => {
    if (formData.productName) {
      const newProduct = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        ...formData,
      };
      setProducts([...products, newProduct]);
      setFormData({});
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = () => {
    if (selectedProduct && formData.productName) {
      const updatedProducts = products.map((p) =>
        p.id === selectedProduct.id ? { ...selectedProduct, ...formData } : p
      );
      setProducts(updatedProducts);
      setFormData({});
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Content */}
        <Card className=" backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-gray-900">
                  Product Catalog
                </CardTitle>
                <CardDescription>
                  Manage your plastic colorant inventory
                </CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className=" text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new plastic colorant product.
                    </DialogDescription>
                  </DialogHeader>
                  <ProductForm formData={formData} setFormData={setFormData} />
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAdd}>Add Product</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10  "
                />
              </div>
              <Select value={filterResin} onValueChange={setFilterResin}>
                <SelectTrigger className="w-full sm:w-[180px] ">
                  <Filter className="h-4 w-4 mr-2" />
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
                <SelectTrigger className="w-full sm:w-[180px] ">
                  <Filter className="h-4 w-4 mr-2" />
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
            </div>

            {/* Products Table */}
            <div className="rounded-md border  overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">
                      Product Name
                    </TableHead>
                    <TableHead className="font-semibold">Resin</TableHead>
                    <TableHead className="font-semibold">Color</TableHead>
                    <TableHead className="font-semibold">
                      Let Down Ratio
                    </TableHead>
                    <TableHead className="font-semibold">MFR</TableHead>
                    <TableHead className="font-semibold">Density</TableHead>
                    <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="hover:bg-yellow-50/50"
                    >
                      <TableCell className="font-medium">
                        {product.productName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.resin}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getColorBadgeClass(product.color)}>
                          {product.color}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.letDownRatio}</TableCell>
                      <TableCell>{product.mfr}</TableCell>
                      <TableCell>{product.density}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsViewDialogOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setFormData(product);
                              setIsEditDialogOpen(true);
                            }}
                            className=" hover:text-yellow-800 hover:bg-yellow-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the product &ldquo;
                                  {product.productName}&rdquo;.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className=""
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update the product details.</DialogDescription>
            </DialogHeader>
            <ProductForm formData={formData} setFormData={setFormData} />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEdit}>Update Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
              <DialogDescription>
                Complete information about the selected product.
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && <ProductDetails product={selectedProduct} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function getColorBadgeClass(color) {
  switch (color.toLowerCase()) {
    case "red":
      return "bg-red-100 text-red-800 border-red-200";
    case "yellow":
      return "bg-yellow-100 text-yellow-800 ";
    case "blue":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "green":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}
