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
import { asyncGetProduct } from "@/store/product/action";

// const products = [
//   { value: "product1", label: "Product 1" },
//   { value: "product2", label: "Product 2" },
//   { value: "product3", label: "Product 3" },
// ];

const formFields = [
  { id: "customerId", label: "Customer Name", mandatory: true },
  { id: "productId", label: "Product Name", mandatory: true },
  { id: "lotNumber", label: "Lot Number", mandatory: true },
  // { id: "quantity", label: "Quantity", mandatory: true },
  { id: "letDownResin", label: "Let Down Resin" },
  { id: "pelletLength", label: "Pellet Length" },
  { id: "pelletDimension", label: "Pellet Dimension" },
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
  { id: "heatStability", label: "Heat Stability" },
  { id: "lightFastness", label: "Light Fastness" },
  { id: "granule", label: "Granule" },
  { id: "deltaE", label: "Delta E" },
  { id: "macaroni", label: "Macaroni" },
];

const dateFields = [
  { id: "mfgDate", label: "Manufacturing Date" },
  { id: "expiryDate", label: "Expiry Date" },
  { id: "analysisDate", label: "Analysis Date" },
];

export default function CoaCreateInput() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customers = useSelector((state) => state.customers);
  const { products } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    customerId: "",
    productId: "",
    lotNumber: "",
    quantity: "",
    letDownResin: "",
    pelletLength: "",
    pelletDimension: "",
    pelletVisual: false,
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
    heatStability: "",
    lightFastness: "",
    granule: "",
    deltaE: "",
    macaroni: "",
    mfgDate: null,
    expiryDate: null,
    analysisDate: null,
  });

  useEffect(() => {
    dispatch(asyncGetCustomer());
    dispatch(asyncGetProduct());
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

    if (field.id === "color") {
      return <Input disabled value={formData.color} />;
    }

    if (field.id === "productId") {
      return (
        <Combobox
          items={products?.map((product) => ({
            value: product.id.toString(),
            label: product.productName,
          }))}
          value={formData.productId?.toString()}
          onValueChange={(value) => {
            const selectedProduct = products?.find(
              (p) => p.id.toString() === value
            );
            setFormData((prev) => ({
              ...prev,
              productId: value,
              color: selectedProduct?.color || "",
            }));
          }}
          placeholder="Select product..."
          searchPlaceholder="Search product..."
          emptyMessage="No product found."
        />
      );
    }
    if (field.id === "pelletVisual") {
      return (
        <select
          id={field.id}
          name={field.id}
          value={formData[field.id]}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              [field.id]: e.target.value === "true",
            }))
          }
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          required={isFieldMandatory(field.id)}
        >
          <option value="">Select...</option>
          <option className="text-green-400" value="true">
            Pass
          </option>
          <option className="text-red-400" value="false">
            Not Pass
          </option>
        </select>
      );
    }
    return (
      <Input
        id={field.id}
        name={field.id}
        value={formData[field.id]}
        onChange={handleChange}
        required={isFieldMandatory(field.id)}
        type={
          [
            "quantity",
            "pelletLength",
            "pelletDimension",
            "mfr",
            "density",
            "moisture",
            "carbonContent",
            "weightOfChips",
            "intrinsicViscosity",
            "ashContent",
            "heatStability",
            "lightFastness",
            "deltaE",
            "macaroni",
          ].includes(field.id)
            ? "number"
            : "text"
        }
        min={
          [
            "quantity",
            "pelletLength",
            "pelletDimension",
            "mfr",
            "density",
            "moisture",
            "carbonContent",
            "weightOfChips",
            "intrinsicViscosity",
            "ashContent",
            "heatStability",
            "lightFastness",
            "deltaE",
            "macaroni",
          ].includes(field.id)
            ? "0"
            : undefined
        }
        step={
          [
            "quantity",
            "pelletLength",
            "pelletDimension",
            "mfr",
            "density",
            "moisture",
            "carbonContent",
            "weightOfChips",
            "intrinsicViscosity",
            "ashContent",
            "heatStability",
            "lightFastness",
            "deltaE",
            "macaroni",
          ].includes(field.id)
            ? "0.001"
            : undefined
        }
        inputMode={
          [
            "quantity",
            "pelletLength",
            "pelletDimension",
            "mfr",
            "density",
            "moisture",
            "carbonContent",
            "weightOfChips",
            "intrinsicViscosity",
            "ashContent",
            "heatStability",
            "lightFastness",
            "deltaE",
            "macaroni",
          ].includes(field.id)
            ? "decimal"
            : "text"
        }
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
