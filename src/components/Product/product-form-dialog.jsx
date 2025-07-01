import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

ProductFormDialog.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    productName: PropTypes.string,
    resin: PropTypes.string,
    letDownRatio: PropTypes.string,
    expiredAge: PropTypes.number,
  }),
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

ProductFormDialog.defaultProps = {
  product: null,
  isLoading: false,
};

export default function ProductFormDialog({
  product,
  isOpen,
  onOpenChange,
  onSave,
  isLoading = false,
}) {
  const initialFormState = {
    productName: "",
    resin: "",
    letDownRatio: "",
    expiredAge: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(product);

  const [openResin, setOpenResin] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!formData.resin.trim()) {
      newErrors.resin = "Resin is required";
    }

    if (!formData.expiredAge.trim()) {
      newErrors.expiredAge = "Expired Age is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSubmit = {
      ...formData,
      expiredAge: parseFloat(formData.expiredAge),
    };

    if (product) {
      dataToSubmit.id = product.id;
    }

    onSave(dataToSubmit);
  };

  const resinOptions = ["PP", "PE", "PVC", "PS", "ABS", "PET", "PC"];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isLoading) {
          onOpenChange(open);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Edit the details of your existing product."
              : "Fill in the details to add a new product."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="productName"
                  className={errors.productName ? "text-red-500" : ""}
                >
                  Product Name *
                </Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className={errors.productName ? "border-red-500" : ""}
                  required
                />
                {errors.productName && (
                  <p className="text-xs text-red-500">{errors.productName}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="resin"
                  className={errors.resin ? "text-red-500" : ""}
                >
                  Resin *
                </Label>
                <Popover open={openResin} onOpenChange={setOpenResin}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openResin}
                      className={cn(
                        "justify-between",
                        errors.resin && "border-red-500"
                      )}
                    >
                      {formData.resin || "Select resin type..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search resin..." />
                      <CommandEmpty>No resin found.</CommandEmpty>
                      <CommandGroup>
                        {resinOptions.map((option) => (
                          <CommandItem
                            key={option}
                            value={option}
                            onSelect={(currentValue) => {
                              handleSelectChange("resin", currentValue);
                              setOpenResin(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.resin === option
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.resin && (
                  <p className="text-xs text-red-500">{errors.resin}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="expiredAge"
                  className={errors.expiredAge ? "text-red-500" : ""}
                >
                  Expired Age (in month) *
                </Label>
                <div className="flex">
                  <Input
                    id="expiredAge"
                    type="number"
                    step="0.01"
                    value={formData.expiredAge}
                    onChange={handleChange}
                    className={errors.expiredAge ? "border-red-500" : ""}
                    required
                    min="0"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => {
                      if (e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                    }}
                  />
                  <span className="ml-2 text-center text-sm border-2 p-1 rounded-md">
                    Month
                  </span>
                </div>
                {errors.expiredAge && (
                  <p className="text-xs text-red-500">{errors.expiredAge}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="letDownRatio">Let Down Ratio</Label>
                <Input
                  id="letDownRatio"
                  value={formData.letDownRatio}
                  onChange={handleChange}
                  placeholder="e.g. 1:100"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Saving..." : "Adding..."}
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
