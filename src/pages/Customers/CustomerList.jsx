import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import React from "react";
import { getBadge } from "@/components/common/statusBedge";

const availableFields = [
  "pelletLength",
  "pelletDiameter",
  "visualCheck",
  "colorCheck",
  "dispersibility",
  "mfr",
  "density",
  "moisture",
  "carbonContent",
  "analysisDate",
  "foreignMatter",
  "weightOfChips",
  "intrinsicViscosity",
  "ashContent",
  "heatStability",
  "lightFastness",
  "granule",
  "tintDeltaE",
  "colorDeltaE",
  "deltaP",
  "macaroni",
  "caCO3",
  "odor",
  "nucleatingAgent",
  "hals",
  "hiding",
  "dispersion",
  "contamination",
  "pelletVisual",
];

// Field labels for display
const fieldLabels = {
  pelletLength: "Pellet Length",
  pelletDiameter: "Pellet Diameter",
  visualCheck: "Visual Check",
  colorCheck: "Color Check",
  dispersibility: "Dispersibility",
  mfr: "MFR",
  density: "Density",
  moisture: "Moisture",
  carbonContent: "Carbon Content",
  analysisDate: "Analysis Date",
  foreignMatter: "Foreign Matter",
  weightOfChips: "Weight of Chips",
  intrinsicViscosity: "Intrinsic Viscosity",
  ashContent: "Ash Content",
  heatStability: "Heat Stability",
  lightFastness: "Light Fastness",
  granule: "Granule",
  tintDeltaE: "Tint Delta E",
  colorDeltaE: "Color Delta E",
  deltaP: "Delta P",
  macaroni: "Macaroni",
  caCO3: "CaCO3",
  odor: "Odor",
  nucleatingAgent: "Nucleating Agent",
  hals: "HALS",
  hiding: "Hiding",
  dispersion: "Dispersion",
  contamination: "Contamination",
  pelletVisual: "Pellet Visual",
};

export default function CustomerList() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers);

  useEffect(() => {
    dispatch(asyncGetCustomer());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    mandatoryFields: {},
  });

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

  // Open edit dialog for a customer
  const openEditDialog = (customer) => {
    setEditingCustomer({
      id: customer.id,
      name: customer.name,
      mandatoryFields: { ...(customer.mandatoryFields || {}) },
    });
  };

  // Handle toggle field pada edit
  const handleEditFieldToggle = (field) => {
    setEditingCustomer((prev) => ({
      ...prev,
      mandatoryFields: {
        ...prev.mandatoryFields,
        [field]: !prev.mandatoryFields?.[field],
      },
    }));
  };

  // Save changes edit
  const handleSaveChanges = () => {
    if (!editingCustomer) return;
    // Hanya kirim field yang true
    const filteredFields = {};
    availableFields.forEach((field) => {
      if (editingCustomer.mandatoryFields?.[field])
        filteredFields[field] = true;
    });
    dispatch(
      asyncUpdateCustomer({
        id: editingCustomer.id,
        name: editingCustomer.name,
        mandatoryFields: filteredFields,
      })
    );
    setEditingCustomer(null);
  };

  // Handle toggle field pada add
  const handleNewCustomerFieldToggle = (field) => {
    setNewCustomer((prev) => ({
      ...prev,
      mandatoryFields: {
        ...prev.mandatoryFields,
        [field]: !prev.mandatoryFields?.[field],
      },
    }));
  };

  // Handle input nama customer baru
  const handleNewCustomerNameChange = (e) => {
    setNewCustomer((prev) => ({ ...prev, name: e.target.value }));
  };

  // Handle adding new customer
  const handleAddCustomer = () => {
    if (!newCustomer.name.trim()) return;
    // Hanya kirim field yang true
    const filteredFields = {};
    availableFields.forEach((field) => {
      if (newCustomer.mandatoryFields?.[field]) filteredFields[field] = true;
    });
    dispatch(
      asyncAddCustomer({
        name: newCustomer.name.trim(),
        mandatoryFields: filteredFields,
      })
    );
    setNewCustomer({ name: "", mandatoryFields: {} });
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
                  <React.Fragment key={customer.id}>
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
                          {availableFields
                            .filter((field) =>
                              customer.mandatoryFields
                                ? customer.mandatoryFields[field]
                                : customer[field]
                            )
                            .map((field) => (
                              <React.Fragment key={field}>
                                {getBadge({
                                  value: fieldLabels[field] || field,
                                  type: "customer",
                                  className:
                                    "bg-yellow-50 text-yellow-800 border-yellow-200",
                                })}
                              </React.Fragment>
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
                      <TableRow key={customer.id + "-expand"}>
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
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
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
        open={!!editingCustomer}
        onOpenChange={(open) => !open && setEditingCustomer(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] bg-secondary overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Mandatory Fields</DialogTitle>
            <DialogDescription>
              Select the fields that are mandatory for{" "}
              {customers?.find((c) => c.id === editingCustomer?.id)?.name ||
                "this customer"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {availableFields.map((field) => (
              <div key={field} className="flex items-center space-x-2">
                <Checkbox
                  id={`field-${field}`}
                  checked={!!editingCustomer?.mandatoryFields?.[field]}
                  onCheckedChange={() => handleEditFieldToggle(field)}
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
            <Button variant="outline" onClick={() => setEditingCustomer(null)}>
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
        onOpenChange={(open) =>
          !open && setNewCustomer({ name: "", mandatoryFields: {} })
        }
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
                value={newCustomer.name}
                onChange={(e) => handleNewCustomerNameChange(e)}
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
                      checked={!!newCustomer.mandatoryFields?.[field]}
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomer}
              className="gap-2"
              disabled={!newCustomer.name.trim()}
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
