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

const resinOptions = ["PP", "PE", "PVC", "PS", "ABS", "PET", "PC"];

function useProductForm(initialState) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [openResin, setOpenResin] = useState(false);

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

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    openResin,
    setOpenResin,
    handleChange,
    handleSelectChange,
    validateForm,
  };
}

export function ProductCreateDialog({
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
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    openResin,
    setOpenResin,
    handleChange,
    handleSelectChange,
    validateForm,
  } = useProductForm(initialFormState);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const dataToSubmit = {
      ...formData,
      expiredAge: parseFloat(formData.expiredAge),
    };
    onSave(dataToSubmit);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isLoading) onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
          <DialogDescription>
            Isi detail untuk menambah produk baru.
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
                  Nama Produk *
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
                      {formData.resin || "Pilih tipe resin..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Cari resin..." />
                      <CommandEmpty>Tidak ada resin.</CommandEmpty>
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
                  Expired Age (bulan) *
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
                    Bulan
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
                  placeholder="cth: 1:100"
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
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menambah...
                </>
              ) : (
                "Tambah Produk"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

ProductCreateDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export function ProductUpdateDialog({
  product,
  isOpen,
  onOpenChange,
  onSave,
  isLoading = false,
}) {
  const initialFormState = {
    productName: product?.productName || "",
    resin: product?.resin || "",
    letDownRatio: product?.letDownRatio || "",
    expiredAge:
      product?.expiredAge !== undefined && product?.expiredAge !== null
        ? String(product.expiredAge)
        : "",
  };
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    openResin,
    setOpenResin,
    handleChange,
    handleSelectChange,
    validateForm,
  } = useProductForm(initialFormState);

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        productName: product.productName || "",
        resin: product.resin || "",
        letDownRatio: product.letDownRatio || "",
        expiredAge:
          product.expiredAge !== undefined && product.expiredAge !== null
            ? String(product.expiredAge)
            : "",
      });
      setErrors({});
    }
    // eslint-disable-next-line
  }, [product?.id, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const dataToSubmit = {
      ...formData,
      id: product.id,
    };
    onSave(dataToSubmit);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isLoading) onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle>
          <DialogDescription>
            Edit detail produk yang sudah ada.
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
                  Nama Produk *
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
                      {formData.resin || "Pilih tipe resin..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Cari resin..." />
                      <CommandEmpty>Tidak ada resin.</CommandEmpty>
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
                  Expired Age (bulan) *
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
                    Bulan
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
                  placeholder="cth: 1:100"
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
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

ProductUpdateDialog.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    productName: PropTypes.string,
    resin: PropTypes.string,
    letDownRatio: PropTypes.string,
    expiredAge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
