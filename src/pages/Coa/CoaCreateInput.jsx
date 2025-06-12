import { useEffect, useState } from "react";
import { CalendarIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { asyncCreateCoa } from "@/store/coa/action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Combobox } from "@/components/ui/combo-box";
import { asyncGetCustomer } from "@/store/customer/action";

const products = [
  { value: "product1", label: "Product 1" },
  { value: "product2", label: "Product 2" },
  { value: "product3", label: "Product 3" },
];

const formFields = [
  { id: "customerId", label: "Customer Name", mandatory: true },
  { id: "productName", label: "Product Name", mandatory: true },
  { id: "lotNumber", label: "Lot Number", mandatory: true },
  { id: "letDownResin", label: "Let Down Resin" },
  { id: "pelletSize", label: "Pellet Size" },
  { id: "pelletVisual", label: "Pellet Visual" },
  { id: "color", label: "Color" },
  { id: "dispersibility", label: "Dispersibility" },
  { id: "mfr", label: "MFR" },
  { id: "density", label: "Density" },
  { id: "moisture", label: "Moisture" },
  { id: "carbonContent", label: "Carbon Content" },
  { id: "foreignMatter", label: "Foreign Matter" },
  { id: "weightOfChips", label: "Weight of Chips" },
  { id: "intrinsicViscosity", label: "Intrinsic Viscosity" },
  { id: "ashContent", label: "Ash Content" },
];

const dateFields = [
  { id: "mfgDate", label: "Manufacturing Date" },
  { id: "expiryDate", label: "Expiry Date" },
  { id: "analysisDate", label: "Analysis Date" },
];

export default function CoaCreateInput() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers } = useSelector((state) => state.customers);

  const [formData, setFormData] = useState({
    customerId: "",
    productName: "",
    lotNumber: "",
    letDownResin: "",
    pelletSize: "",
    pelletVisual: "",
    color: "",
    dispersibility: "",
    mfr: "",
    density: "",
    moisture: "",
    carbonContent: "",
    foreignMatter: "",
    weightOfChips: "",
    intrinsicViscosity: "",
    ashContent: "",
    mfgDate: null,
    expiryDate: null,
    analysisDate: null,
  });

  useEffect(() => {
    dispatch(asyncGetCustomer());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { status, message } = await dispatch(asyncCreateCoa(formData));
      if (status !== "success") console.error(message);
      navigate("/COA");
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj)) return "";
    return dateObj
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };

  const renderDateField = ({ id, label }) => (
    <div key={label} className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !formData[id] && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formData[id] ? formatDate(formData[id]) : <span>Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={formData[id]}
            onSelect={handleDateChange(id)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  const getMandatoryFields = (customerId) => {
    const customer = customers?.find((c) => c.id.toString() === customerId);
    return customer?.mandatoryFields?.map((field) => field.fieldName) || [];
  };

  const isFieldMandatory = (fieldId) => {
    if (!formData.customerId) return false;
    return getMandatoryFields(formData.customerId).includes(fieldId);
  };

  const renderFormFields = () => {
    const mandatoryFields = formFields.filter(
      (field) => field.mandatory || isFieldMandatory(field.id)
    );
    const optionalFields = formFields.filter(
      (field) => !field.mandatory && !isFieldMandatory(field.id)
    );

    return (
      <>
        {mandatoryFields.length > 0 && (
          <>
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mandatory Fields
              </h3>
            </div>
            {mandatoryFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                {renderFieldInput(field)}
              </div>
            ))}
            <div className="col-span-2 border-b border-gray-200 my-6"></div>
          </>
        )}

        <div className="col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Optional Fields
          </h3>
        </div>
        {optionalFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            {renderFieldInput(field)}
          </div>
        ))}
      </>
    );
  };

  const renderFieldInput = (field) => {
    if (field.id === "customerId") {
      return (
        <Combobox
          items={customers?.map((customer) => ({
            value: customer.id.toString(),
            label: customer.name,
          }))}
          value={formData.customerId?.toString()}
          onValueChange={(value) => {
            setFormData((prev) => ({ ...prev, customerId: value }));
          }}
          placeholder="Pilih customer..."
          searchPlaceholder="Cari customer..."
          emptyMessage="Customer tidak ditemukan."
        />
      );
    }
    if (field.id === "productName") {
      return (
        <Combobox
          items={products}
          value={formData[field.id]}
          onValueChange={(value) => {
            setFormData((prev) => ({ ...prev, [field.id]: value }));
          }}
          placeholder="Select product..."
          searchPlaceholder="Search product..."
          emptyMessage="No product found."
        />
      );
    }
    return (
      <Input
        id={field.id}
        name={field.id}
        value={formData[field.id]}
        onChange={handleChange}
        required={isFieldMandatory(field.id)}
        min={field.id === "quantity" ? "0" : undefined}
        step={field.id === "quantity" ? "0.001" : undefined}
        inputMode={field.id === "quantity" ? "decimal" : "text"}
      />
    );
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2">
            <CardTitle>COA Input Form</CardTitle>
            <CardDescription>Please enter complete COA data</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFormFields()}
              {dateFields.map((field) => renderDateField(field))}
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
