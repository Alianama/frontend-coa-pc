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
import { Separator } from "@/components/ui/separator";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { Loader2 } from "lucide-react";

ProductFormDialog.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    productName: PropTypes.string,
    resin: PropTypes.string,
    letDownRatio: PropTypes.string,
    pellet: PropTypes.string,
    color: PropTypes.string,
    dispersibility: PropTypes.string,
    mfr: PropTypes.number,
    density: PropTypes.number,
    moisture: PropTypes.number,
    carbonContent: PropTypes.number,
    foreignMatter: PropTypes.string,
    weightOfChips: PropTypes.number,
    intrinsicViscosity: PropTypes.number,
    ashContent: PropTypes.number,
    heatStability: PropTypes.number,
    lightFastness: PropTypes.number,
    granule: PropTypes.string,
    deltaE: PropTypes.number,
    macaroni: PropTypes.number,
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
  const [formData, setFormData] = useState({
    productName: "",
    resin: "",
    letDownRatio: "",
    pellet: "",
    color: "",
    dispersibility: "",
    mfr: 0,
    density: 0,
    moisture: 0,
    carbonContent: 0,
    foreignMatter: "",
    weightOfChips: 0,
    intrinsicViscosity: 0,
    ashContent: 0,
    heatStability: 0,
    lightFastness: 0,
    granule: "",
    deltaE: 0,
    macaroni: 0,
  });

  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(product);

  const [openResin, setOpenResin] = useState(false);
  const [openPellet, setOpenPellet] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openDispersibility, setOpenDispersibility] = useState(false);
  const [openGranule, setOpenGranule] = useState(false);
  const [openForeignMatter, setOpenForeignMatter] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        productName: "",
        resin: "",
        letDownRatio: "",
        pellet: "",
        color: "",
        dispersibility: "",
        mfr: 0,
        density: 0,
        moisture: 0,
        carbonContent: 0,
        foreignMatter: "",
        weightOfChips: 0,
        intrinsicViscosity: 0,
        ashContent: 0,
        heatStability: 0,
        lightFastness: 0,
        granule: "",
        deltaE: 0,
        macaroni: 0,
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? Number.parseFloat(value) : value,
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

    if (!formData.color.trim()) {
      newErrors.color = "Color is required";
    }

    if (!formData.pellet.trim()) {
      newErrors.pellet = "Pellet is required";
    }

    if (formData.mfr < 0) {
      newErrors.mfr = "MFR cannot be negative";
    }

    if (formData.density <= 0) {
      newErrors.density = "Density must be positive";
    }

    if (formData.moisture < 0 || formData.moisture > 100) {
      newErrors.moisture = "Moisture must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSubmit = product
      ? { ...formData, id: product.id }
      : { ...formData };

    onSave(dataToSubmit);
  };

  const resinOptions = ["PP", "PE", "PVC", "PS", "ABS", "PET", "PC"];
  const pelletOptions = ["Masterbatch", "Compound", "Additive", "Concentrate"];
  const colorOptions = [
    "Red",
    "Yellow",
    "Blue",
    "Green",
    "Black",
    "White",
    "Orange",
    "Purple",
    "Brown",
    "Gold",
  ];
  const dispersibilityOptions = ["Excellent", "Good", "Fair", "Poor"];
  const granuleOptions = ["Regular", "Fine", "Coarse", "Micro"];
  const foreignMatterOptions = ["None", "Trace", "Minimal", "Present"];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isLoading) {
          onOpenChange(open);
        }
      }}
    >
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  htmlFor="color"
                  className={errors.color ? "text-red-500" : ""}
                >
                  Color *
                </Label>
                <Popover open={openColor} onOpenChange={setOpenColor}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openColor}
                      className={cn(
                        "justify-between",
                        errors.color && "border-red-500"
                      )}
                    >
                      {formData.color || "Select color..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search color..." />
                      <CommandEmpty>No color found.</CommandEmpty>
                      <CommandGroup>
                        {colorOptions.map((option) => (
                          <CommandItem
                            key={option}
                            value={option}
                            onSelect={(currentValue) => {
                              handleSelectChange("color", currentValue);
                              setOpenColor(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: option.toLowerCase(),
                                  border:
                                    option.toLowerCase() === "white"
                                      ? "1px solid #e2e8f0"
                                      : "none",
                                }}
                              />
                              {option}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.color && (
                  <p className="text-xs text-red-500">{errors.color}</p>
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

              <div className="grid gap-2">
                <Label
                  htmlFor="pellet"
                  className={errors.pellet ? "text-red-500" : ""}
                >
                  Pellet *
                </Label>
                <Popover open={openPellet} onOpenChange={setOpenPellet}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPellet}
                      className={cn(
                        "justify-between",
                        errors.pellet && "border-red-500"
                      )}
                    >
                      {formData.pellet || "Select pellet type..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search pellet..." />
                      <CommandEmpty>No pellet found.</CommandEmpty>
                      <CommandGroup>
                        {pelletOptions.map((option) => (
                          <CommandItem
                            key={option}
                            value={option}
                            onSelect={(currentValue) => {
                              handleSelectChange("pellet", currentValue);
                              setOpenPellet(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.pellet === option
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
                {errors.pellet && (
                  <p className="text-xs text-red-500">{errors.pellet}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Physical Properties */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Physical Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dispersibility">Dispersibility</Label>
                <Popover
                  open={openDispersibility}
                  onOpenChange={setOpenDispersibility}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDispersibility}
                    >
                      {formData.dispersibility || "Select dispersibility..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search dispersibility..." />
                      <CommandEmpty>No dispersibility found.</CommandEmpty>
                      <CommandGroup>
                        {dispersibilityOptions.map((option) => (
                          <CommandItem
                            key={option}
                            value={option}
                            onSelect={(currentValue) => {
                              handleSelectChange(
                                "dispersibility",
                                currentValue
                              );
                              setOpenDispersibility(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.dispersibility === option
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
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="mfr"
                  className={errors.mfr ? "text-red-500" : ""}
                >
                  MFR
                </Label>
                <Input
                  id="mfr"
                  type="number"
                  step="0.1"
                  value={formData.mfr}
                  onChange={handleChange}
                  className={errors.mfr ? "border-red-500" : ""}
                />
                {errors.mfr && (
                  <p className="text-xs text-red-500">{errors.mfr}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="density"
                  className={errors.density ? "text-red-500" : ""}
                >
                  Density
                </Label>
                <Input
                  id="density"
                  type="number"
                  step="0.01"
                  value={formData.density}
                  onChange={handleChange}
                  className={errors.density ? "border-red-500" : ""}
                />
                {errors.density && (
                  <p className="text-xs text-red-500">{errors.density}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="weightOfChips">Weight of Chips</Label>
                <Input
                  id="weightOfChips"
                  type="number"
                  step="0.1"
                  value={formData.weightOfChips}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="granule">Granule</Label>
                <Popover open={openGranule} onOpenChange={setOpenGranule}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openGranule}
                    >
                      {formData.granule || "Select granule type..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search granule..." />
                      <CommandEmpty>No granule found.</CommandEmpty>
                      <CommandGroup>
                        {granuleOptions.map((option) => (
                          <CommandItem
                            key={option}
                            value={option}
                            onSelect={(currentValue) => {
                              handleSelectChange("granule", currentValue);
                              setOpenGranule(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.granule === option
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
              </div>
            </div>
          </div>

          <Separator />

          {/* Chemical Properties */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Chemical Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="moisture"
                  className={errors.moisture ? "text-red-500" : ""}
                >
                  Moisture (%)
                </Label>
                <Input
                  id="moisture"
                  type="number"
                  step="0.01"
                  value={formData.moisture}
                  onChange={handleChange}
                  className={errors.moisture ? "border-red-500" : ""}
                />
                {errors.moisture && (
                  <p className="text-xs text-red-500">{errors.moisture}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="carbonContent">Carbon Content</Label>
                <Input
                  id="carbonContent"
                  type="number"
                  step="0.1"
                  value={formData.carbonContent}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="foreignMatter">Foreign Matter</Label>
                <Popover
                  open={openForeignMatter}
                  onOpenChange={setOpenForeignMatter}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openForeignMatter}
                    >
                      {formData.foreignMatter ||
                        "Select foreign matter status..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search foreign matter..." />
                      <CommandEmpty>No foreign matter found.</CommandEmpty>
                      <CommandGroup>
                        {foreignMatterOptions.map((option) => (
                          <CommandItem
                            key={option}
                            value={option}
                            onSelect={(currentValue) => {
                              handleSelectChange("foreignMatter", currentValue);
                              setOpenForeignMatter(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.foreignMatter === option
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
              </div>

              <div className="grid gap-2">
                <Label htmlFor="intrinsicViscosity">Intrinsic Viscosity</Label>
                <Input
                  id="intrinsicViscosity"
                  type="number"
                  step="0.1"
                  value={formData.intrinsicViscosity}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ashContent">Ash Content</Label>
                <Input
                  id="ashContent"
                  type="number"
                  step="0.01"
                  value={formData.ashContent}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Performance Properties */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Performance Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="heatStability">Heat Stability (°C)</Label>
                <Input
                  id="heatStability"
                  type="number"
                  value={formData.heatStability}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lightFastness">Light Fastness (1-8)</Label>
                <Input
                  id="lightFastness"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.lightFastness}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="deltaE">Delta E</Label>
                <Input
                  id="deltaE"
                  type="number"
                  step="0.1"
                  value={formData.deltaE}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="macaroni">Macaroni</Label>
                <Input
                  id="macaroni"
                  type="number"
                  step="0.1"
                  value={formData.macaroni}
                  onChange={handleChange}
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
