"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  X,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncGetCustomer,
  asyncUpdateCustomer,
  asyncAddCustomer,
  asyncDeleteCustomer,
} from "@/store/customer/action";

// Available fields for selection
const availableFields = [
  // "customerId",
  // "productName",
  // "lotNumber",
  // "quantity",
  "letDownResin",
  "pelletLength",
  "pelletHeight",
  "pelletVisual",
  "color",
  "dispersibility",
  "mfr",
  "density",
  "moisture",
  "carbonContent",
  "mfgDate",
  "expiryDate",
  "analysisDate",
  "foreignMatter",
  "weightOfChips",
  "intrinsicViscosity",
  "ashContent",
  "heatStability",
  "lightFastness",
  "granule",
  "deltaE",
  "macaroni",
];

// Field labels for display
const fieldLabels = {
  letDownResin: "Let Down Resin",
  pelletLength: "Pellet Length",
  pelletHeight: "Pellet Height",
  pelletVisual: "Pellet Visual",
  color: "Color",
  dispersibility: "Dispersibility",
  mfr: "MFR",
  density: "Density",
  moisture: "Moisture",
  carbonContent: "Carbon Content",
  mfgDate: "Manufacturing Date",
  expiryDate: "Expiry Date",
  analysisDate: "Analysis Date",
  foreignMatter: "Foreign Matter",
  weightOfChips: "Weight of Chips",
  intrinsicViscosity: "Intrinsic Viscosity",
  ashContent: "Ash Content",
  heatStability: "Heat Stability",
  lightFastness: "Light Fastness",
  granule: "Granule",
  deltaE: "Delta E",
  macaroni: "Macaroni",
};

export default function CustomerList() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers);

  useEffect(() => {
    dispatch(asyncGetCustomer());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerFields, setNewCustomerFields] = useState([]);

  console.log({ newCustomerFields, newCustomerName });

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Toggle row expansion
  const toggleRowExpansion = (customerId) => {
    setExpandedRows((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  // Filter customers based on search term
  const filteredCustomers = customers?.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle field selection toggle
  const handleFieldToggle = (fieldName) => {
    setSelectedFields((prev) =>
      prev.includes(fieldName)
        ? prev.filter((f) => f !== fieldName)
        : [...prev, fieldName]
    );
  };

  // Open edit dialog for a customer
  const openEditDialog = (customer) => {
    setEditingCustomerId(customer.id);
    setSelectedFields(customer.mandatoryFields.map((field) => field.fieldName));
  };

  // Save changes to mandatory fields
  const handleSaveChanges = () => {
    if (editingCustomerId === null) return;

    const customer = customers.find((c) => c.id === editingCustomerId);
    if (!customer) return;

    const updatedCustomer = {
      id: customer.id,
      name: customer.name,
      mandatoryFields: selectedFields,
    };

    dispatch(asyncUpdateCustomer(updatedCustomer));
    setEditingCustomerId(null);
  };

  // Handle new customer field toggle
  const handleNewCustomerFieldToggle = (fieldName) => {
    setNewCustomerFields((prev) =>
      prev.includes(fieldName)
        ? prev.filter((f) => f !== fieldName)
        : [...prev, fieldName]
    );
  };

  // Handle adding new customer
  const handleAddCustomer = () => {
    if (!newCustomerName.trim()) return;

    const newCustomer = {
      name: newCustomerName.trim(),
      mandatoryFields: newCustomerFields,
    };

    dispatch(asyncAddCustomer(newCustomer));
    resetAddCustomerForm();
  };

  // Reset add customer form
  const resetAddCustomerForm = () => {
    setNewCustomerName("");
    setNewCustomerFields([]);
    setIsAddDialogOpen(false);
  };

  // Handle delete customer
  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      dispatch(asyncDeleteCustomer(customerToDelete.id));
      setIsDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Data</h1>
          <p className="text-gray-600 text-sm">
            Manage customer information and mandatory fields
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Customer List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mandatory Fields</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers?.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <>
                    <TableRow key={customer.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleRowExpansion(customer.id)}
                          className="h-8 w-8"
                        >
                          {expandedRows.includes(customer.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {customer.mandatoryFields.map((field) => (
                            <Badge
                              key={field.id}
                              variant="secondary"
                              className="bg-yellow-50 text-yellow-800 border-yellow-200"
                            >
                              {fieldLabels[field.fieldName] || field.fieldName}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(customer.updatedAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditDialog(customer)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Fields
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCustomer(customer)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {expandedRows.includes(customer.id) && (
                      <TableRow>
                        <TableCell colSpan={5} className="bg-gray-50 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">
                                Customer ID:
                              </span>
                              <p className="text-gray-600">{customer.id}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Created:
                              </span>
                              <p className="text-gray-600">
                                {formatDate(customer.createdAt)}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-medium text-gray-700">
                                Mandatory Fields:
                              </span>
                              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                                {customer.mandatoryFields.map((field) => (
                                  <div
                                    key={field.id}
                                    className="flex items-center"
                                  >
                                    <Badge
                                      variant="secondary"
                                      className="bg-yellow-50 text-yellow-800 border-yellow-200 mr-2"
                                    >
                                      {fieldLabels[field.fieldName] ||
                                        field.fieldName}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No customers found matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-secondary">
          <DialogHeader>
            <DialogTitle>Hapus Customer</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus customer{" "}
              <span className="font-semibold">{customerToDelete?.name}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-5 ">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setCustomerToDelete(null);
              }}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editingCustomerId !== null}
        onOpenChange={(open) => !open && setEditingCustomerId(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] bg-secondary overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Mandatory Fields</DialogTitle>
            <DialogDescription>
              Select the fields that are mandatory for{" "}
              {customers?.find((c) => c.id === editingCustomerId)?.name ||
                "this customer"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {availableFields.map((field) => (
              <div key={field} className="flex items-center space-x-2">
                <Checkbox
                  id={`field-${field}`}
                  checked={selectedFields.includes(field)}
                  onCheckedChange={() => handleFieldToggle(field)}
                />
                <label
                  htmlFor={`field-${field}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {fieldLabels[field]}
                </label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingCustomerId(null)}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => !open && resetAddCustomerForm()}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] bg-secondary overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter customer name and select mandatory fields for the new
              customer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label
                htmlFor="customer-name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Customer Name
              </label>
              <Input
                id="customer-name"
                placeholder="Enter customer name..."
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mandatory Fields
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFields.map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={`new-field-${field}`}
                      checked={newCustomerFields.includes(field)}
                      onCheckedChange={() =>
                        handleNewCustomerFieldToggle(field)
                      }
                    />
                    <label
                      htmlFor={`new-field-${field}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {fieldLabels[field]}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetAddCustomerForm}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomer}
              className="gap-2"
              disabled={!newCustomerName.trim()}
            >
              <Plus className="w-4 h-4" />
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
