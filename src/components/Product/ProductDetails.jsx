import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropTypes from "prop-types";

export default function ProductDetails({ product }) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="technical">Technical Specs</TabsTrigger>
        <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">
              Product Name
            </Label>
            <p className="text-sm font-semibold">{product.productName}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">Resin</Label>
            <Badge
              variant="outline"
              className="border-yellow-300 text-yellow-700"
            >
              {product.resin}
            </Badge>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">Color</Label>
            <Badge className={getColorBadgeClass(product.color)}>
              {product.color}
            </Badge>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">
              Let Down Ratio
            </Label>
            <p className="text-sm">{product.letDownRatio}</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="technical" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">MFR</Label>
            <p className="text-sm">{product.mfr}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">Density</Label>
            <p className="text-sm">{product.density}</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="quality" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">
              Heat Stability (°C)
            </Label>
            <p className="text-sm">{product.heatStability}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-500">
              Light Fastness
            </Label>
            <p className="text-sm">{product.lightFastness}/8</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function getColorBadgeClass(color) {
  switch (color.toLowerCase()) {
    case "red":
      return "bg-red-100 text-red-800";
    case "yellow":
      return "bg-yellow-100 text-yellow-800";
    case "blue":
      return "bg-blue-100 text-blue-800";
    case "green":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

ProductDetails.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    productName: PropTypes.string.isRequired,
    resin: PropTypes.string.isRequired,
    letDownRatio: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    mfr: PropTypes.number.isRequired,
    density: PropTypes.number.isRequired,
    heatStability: PropTypes.number.isRequired,
    lightFastness: PropTypes.number.isRequired,
  }).isRequired,
};
