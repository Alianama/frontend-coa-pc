import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropTypes from "prop-types";

export default function ProductForm({ formData, setFormData }) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="technical">Technical</TabsTrigger>
        <TabsTrigger value="quality">Quality</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={formData.productName || ""}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              className="border-yellow-200 focus:border-yellow-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resin">Resin</Label>
            <Select
              value={formData.resin || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, resin: value })
              }
            >
              <SelectTrigger className="border-yellow-200">
                <SelectValue placeholder="Select resin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PP">PP</SelectItem>
                <SelectItem value="PE">PE</SelectItem>
                <SelectItem value="PVC">PVC</SelectItem>
                <SelectItem value="PS">PS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select
              value={formData.color || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, color: value })
              }
            >
              <SelectTrigger className="border-yellow-200">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Red">Red</SelectItem>
                <SelectItem value="Yellow">Yellow</SelectItem>
                <SelectItem value="Blue">Blue</SelectItem>
                <SelectItem value="Green">Green</SelectItem>
                <SelectItem value="Black">Black</SelectItem>
                <SelectItem value="White">White</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="letDownRatio">Let Down Ratio</Label>
            <Input
              id="letDownRatio"
              value={formData.letDownRatio || ""}
              onChange={(e) =>
                setFormData({ ...formData, letDownRatio: e.target.value })
              }
              className="border-yellow-200 focus:border-yellow-400"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="technical" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mfr">MFR</Label>
            <Input
              id="mfr"
              type="number"
              step="0.1"
              value={formData.mfr || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mfr: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="border-yellow-200 focus:border-yellow-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="density">Density</Label>
            <Input
              id="density"
              type="number"
              step="0.01"
              value={formData.density || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  density: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="border-yellow-200 focus:border-yellow-400"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="quality" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="heatStability">Heat Stability (°C)</Label>
            <Input
              id="heatStability"
              type="number"
              value={formData.heatStability || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heatStability: Number.parseInt(e.target.value) || 0,
                })
              }
              className="border-yellow-200 focus:border-yellow-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lightFastness">Light Fastness</Label>
            <Input
              id="lightFastness"
              type="number"
              min="1"
              max="8"
              value={formData.lightFastness || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lightFastness: Number.parseInt(e.target.value) || 0,
                })
              }
              className="border-yellow-200 focus:border-yellow-400"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

ProductForm.propTypes = {
  formData: PropTypes.shape({
    productName: PropTypes.string,
    resin: PropTypes.string,
    color: PropTypes.string,
    letDownRatio: PropTypes.string,
    mfr: PropTypes.number,
    density: PropTypes.number,
    heatStability: PropTypes.number,
    lightFastness: PropTypes.number,
  }),
  setFormData: PropTypes.func.isRequired,
};
