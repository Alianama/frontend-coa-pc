import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

export default function ProductDetailDialog({ product, isOpen, onOpenChange }) {
  if (!product) return null;

  const renderProperty = (label, value) => (
    <div key={label} className="grid grid-cols-2 items-center gap-4 py-2">
      <div className="text-sm font-medium text-gray-600">{label}:</div>
      <div className="text-sm">{value || "-"}</div>
    </div>
  );

  ProductDetailDialog.propTypes = {
    product: PropTypes.shape({
      id: PropTypes.number,
      productName: PropTypes.string,
      resin: PropTypes.string,
      letDownRatio: PropTypes.string,
      expiredAge: PropTypes.number,
    }),
    isOpen: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
  };

  ProductDetailDialog.defaultProps = {
    product: null,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {product.productName}
            <div
              className="w-4 h-4 rounded-full inline-block"
              style={{
                backgroundColor: product.expiredAge,
                border:
                  product.expiredAge === "white" ? "1px solid #e2e8f0" : "none",
              }}
            />
          </DialogTitle>
          <DialogDescription>Product ID: {product.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              Product Information
            </h3>
            <div className="space-y-1">
              {renderProperty("Product Name", product.productName)}
              {renderProperty("Resin", product.resin)}
              {renderProperty("Expired Age", `${product.expiredAge} month`)}
              {renderProperty("Let Down Ratio", product.letDownRatio)}
            </div>
          </div>
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
