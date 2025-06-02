import React, { useState } from "react";
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

export default function CoaCreateInput() {
  const [formData, setFormData] = useState({
    costumerName: "",
    productName: "",
    lotNumber: "",
    quantity: "",
    letDownResin: "",
    pelletSize: "",
    pelletVisual: "",
    color: "",
    dispersibility: "",
    mfr: "",
    density: "",
    moisture: "",
    carbonContent: "",
    mfgDate: null,
    expiryDate: null,
    analysisDate: null,
    printedDate: null,
    foreignMatter: "",
    weightOfChips: "",
    intrinsicViscosity: "",
    ashContent: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const formatDate = (date) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>COA Input Form</CardTitle>
          <CardDescription>Please enter complete COA data</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="costumerName">Customer Name</Label>
                <Input
                  id="costumerName"
                  name="costumerName"
                  value={formData.costumerName}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lotNumber">Lot Number</Label>
                <Input
                  id="lotNumber"
                  name="lotNumber"
                  value={formData.lotNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="letDownResin">Let Down Resin</Label>
                <Input
                  id="letDownResin"
                  name="letDownResin"
                  value={formData.letDownResin}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pelletSize">Pellet Size</Label>
                <Input
                  id="pelletSize"
                  name="pelletSize"
                  value={formData.pelletSize}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pelletVisual">Pellet Visual</Label>
                <Input
                  id="pelletVisual"
                  name="pelletVisual"
                  value={formData.pelletVisual}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dispersibility">Dispersibility</Label>
                <Input
                  id="dispersibility"
                  name="dispersibility"
                  value={formData.dispersibility}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mfr">MFR</Label>
                <Input
                  id="mfr"
                  name="mfr"
                  value={formData.mfr}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="density">Density</Label>
                <Input
                  id="density"
                  name="density"
                  value={formData.density}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moisture">Moisture Content</Label>
                <Input
                  id="moisture"
                  name="moisture"
                  value={formData.moisture}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carbonContent">Carbon Content</Label>
                <Input
                  id="carbonContent"
                  name="carbonContent"
                  value={formData.carbonContent}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Manufacturing Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.mfgDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.mfgDate ? (
                        formatDate(formData.mfgDate)
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.mfgDate}
                      onSelect={handleDateChange("mfgDate")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiryDate ? (
                        formatDate(formData.expiryDate)
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.expiryDate}
                      onSelect={handleDateChange("expiryDate")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Analysis Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.analysisDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.analysisDate ? (
                        formatDate(formData.analysisDate)
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.analysisDate}
                      onSelect={handleDateChange("analysisDate")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Print Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.printedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.printedDate ? (
                        formatDate(formData.printedDate)
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.printedDate}
                      onSelect={handleDateChange("printedDate")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="forignMater">Benda Asing</Label>
                <Input
                  id="forignMater"
                  name="forignMater"
                  value={formData.forignMater}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightOfChips">Berat Chips</Label>
                <Input
                  id="weightOfChips"
                  name="weightOfChips"
                  value={formData.weightOfChips}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intrinsicViscosity">Viskositas Intrinsik</Label>
                <Input
                  id="intrinsicViscosity"
                  name="intrinsicViscosity"
                  value={formData.intrinsicViscosity}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ashContent">Kandungan Abu</Label>
                <Input
                  id="ashContent"
                  name="ashContent"
                  value={formData.ashContent}
                  onChange={handleChange}
                />
              </div>
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
