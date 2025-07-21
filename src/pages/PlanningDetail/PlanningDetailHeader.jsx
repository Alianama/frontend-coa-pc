import { Card, CardContent } from "@/components/ui/card";
import {
  Factory,
  Calendar,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getBadge } from "@/components/common/statusBedge";

export default function DetailHeader({
  quantityPrinted,
  quantityCheck,
  header,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-3 h-2" />;
      case "progress":
        return <Clock className="w-3 h-3" />;
      case "completed":
        return <CheckCircle2 className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <Card
      className={`w-full mt-4 border border-gray-200 shadow-sm transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex w-full border-b-2 pb-5 items-center gap-10 mb-5">
          <div className="flex w-full gap-10">
            <div className="flex items-center gap-2">
              <Factory className="w-4 h-4 text-gray-600" />
              <h1 className="text-lg font-semibold text-gray-900">
                Lot No: {header?.lotNumber}
              </h1>
            </div>
            <div className="flex border-l-2 pl-5 items-center gap-2">
              <Package className="w-3 h-3 text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs">Quantity Planning</p>
                <p className="font-medium ">
                  {header?.qtyPlanning != null
                    ? `${Number(header?.qtyPlanning).toFixed(2)} kg`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="flex border-l-2 pl-5 items-center gap-2">
              <Package className="w-3 h-3 text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs">Quantity Checking</p>
                <p className="font-medium ">
                  {quantityCheck != null
                    ? `${Number(quantityCheck).toFixed(2)} kg`
                    : "-"}
                </p>
              </div>
            </div>
            <div className="flex border-l-2 pl-5 items-center gap-2">
              <Package className="w-3 h-3 text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs">Quantity Printed</p>
                <p className="font-medium ">
                  {quantityPrinted != null
                    ? `${Number(quantityPrinted).toFixed(2)} kg`
                    : "-"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse w-1/3">
            {getBadge({
              value: header?.status,
              type: "planning",
              icon: getStatusIcon(header?.status),
            })}
          </div>
        </div>

        <div className="flex items-center gap-10 text-sm">
          <div className="border-r-2 pr-5 font-semibold flex flex-col justify-between items-start text-sm min-w-[220px]">
            <div className="flex items-center w-full">
              <span className="w-20 text-sm">Customer</span>
              <span className="mx-1">:</span>
              <span className="flex-1">{header?.customerName}</span>
            </div>
            <div className="flex items-center w-full">
              <span className="w-20">Product</span>
              <span className="mx-1">:</span>
              <span className="flex-1">{header?.productName}</span>
            </div>
            <div className="flex items-center w-full">
              <span className="w-20">Created</span>
              <span className="mx-1">:</span>
              <span className="flex-1">{formatDate(header?.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-3 h-3 text-gray-400" />
            <div>
              <p className="text-gray-500 text-xs">Resin</p>
              <p className="font-medium ">
                {header?.resin} - ratio {header?.ratio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Factory className="w-3 h-3 text-gray-400" />
            <div>
              <p className="text-gray-500 text-xs">Moulding</p>
              <p className="font-medium ">{header?.moulding}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 " />
            <div>
              <p className="text-gray-500 text-xs">Mfg Date</p>
              <p className="font-medium ">{formatDate(header?.mfgDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-gray-400" />
            <div>
              <p className="text-gray-500 text-xs">Expiry</p>
              <p className="font-medium ">{formatDate(header?.expiryDate)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

DetailHeader.propTypes = {
  quantityPrinted: PropTypes.number,
  quantityCheck: PropTypes.number,
  header: PropTypes.shape({
    lotNumber: PropTypes.string,
    qtyPlanning: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    resin: PropTypes.string,
    ratio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    moulding: PropTypes.string,
    mfgDate: PropTypes.string,
    expiryDate: PropTypes.string,
    customerName: PropTypes.string,
    productName: PropTypes.string,
    createdAt: PropTypes.string,
  }),
};
