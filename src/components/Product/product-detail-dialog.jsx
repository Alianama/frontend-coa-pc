"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PropTypes from "prop-types";

export default function ProductDetailDialog({ product, isOpen, onOpenChange }) {
  if (!product) return null;

  const renderPropertyGroup = (title, properties) => (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="grid gap-3">
        {Object.entries(properties).map(([key, value]) => (
          <div key={key} className="grid grid-cols-2 items-center gap-4">
            <div className="text-sm font-medium">{key}:</div>
            <div className="text-sm">
              {typeof value === "number" ? (
                <Badge variant="outline" className="font-mono">
                  {value}
                </Badge>
              ) : (
                value
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Group properties for better organization
  const basicInfo = {
    "Product Name": product.productName,
    Color: product.color,
    Resin: product.resin,
    Pellet: product.pellet,
    "Let Down Ratio": product.letDownRatio,
  };

  const physicalProperties = {
    Dispersibility: product.dispersibility,
    MFR: product.mfr,
    Density: product.density,
    "Weight of Chips": product.weightOfChips,
    Granule: product.granule,
  };

  const chemicalProperties = {
    Moisture: product.moisture,
    "Carbon Content": product.carbonContent,
    "Foreign Matter": product.foreignMatter,
    "Intrinsic Viscosity": product.intrinsicViscosity,
    "Ash Content": product.ashContent,
  };

  const performanceProperties = {
    "Heat Stability": product.heatStability,
    "Light Fastness": product.lightFastness,
    "Delta E": product.deltaE,
    Macaroni: product.macaroni,
  };

  ProductDetailDialog.propTypes = {
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
  };

  ProductDetailDialog.defaultProps = {
    product: null,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {product.productName}
            <div
              className="w-4 h-4 rounded-full inline-block"
              style={{
                backgroundColor: product.color.toLowerCase(),
                border:
                  product.color.toLowerCase() === "white"
                    ? "1px solid #e2e8f0"
                    : "none",
              }}
            />
          </DialogTitle>
          <DialogDescription>Product ID: {product.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {renderPropertyGroup("Basic Information", basicInfo)}
          <Separator />
          {renderPropertyGroup("Physical Properties", physicalProperties)}
          <Separator />
          {renderPropertyGroup("Chemical Properties", chemicalProperties)}
          <Separator />
          {renderPropertyGroup("Performance Properties", performanceProperties)}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
