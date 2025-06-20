import { Badge } from "@/components/ui/badge";
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

export default function DetailHeader(header) {
  const [isVisible, setIsVisible] = useState(false);
  const data = header;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatDate = (dateString) => {
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
              <h2 className="text-lg font-semibold text-gray-900">
                Production Order Lot: {data.header.lotNumber}
              </h2>
            </div>
            <div className="flex border-l-2 pl-5 items-center gap-2">
              <Package className="w-3 h-3 text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs">Quantity Planning</p>
                <p className="font-medium ">
                  {data.header.qtyPlanning != null
                    ? `${Number(data.header.qtyPlanning).toFixed(2)} kg`
                    : "-"}
                </p>
              </div>
            </div>
            <div className="flex border-l-2 pl-5 items-center gap-2">
              <Package className="w-3 h-3 text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs">Quantity Checking</p>
                <p className="font-medium ">
                  {data.quantityCheck != null
                    ? `${Number(data.quantityCheck).toFixed(2)} kg`
                    : "-"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse w-1/3">
            <Badge
              variant="outline"
              className={`text-xs px-2 py-1 ${
                data.header.status === "progress"
                  ? "border-blue-200 text-blue-700 bg-blue-50"
                  : data.header.status === "open"
                  ? "border-red-200 text-red-700 bg-red-50"
                  : data.header.status === "completed"
                  ? "border-green-200 text-green-700 bg-green-50"
                  : "border-gray-200 text-gray-700 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-1">
                {getStatusIcon(data.header.status)}
                <span className="capitalize">{data.header.status}</span>
              </div>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Package className="w-3 h-3 text-gray-400" />
            <div>
              <p className="text-gray-500 text-xs">Material</p>
              <p className="font-medium ">
                {data.header.resin} {data.header.ratio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Factory className="w-3 h-3 text-gray-400" />
            <div>
              <p className="text-gray-500 text-xs">Moulding</p>
              <p className="font-medium ">{data.header.moulding}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 " />
            <div>
              <p className="text-gray-500 text-xs">Mfg Date</p>
              <p className="font-medium ">{formatDate(data.header.mfgDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-gray-400" />
            <div>
              <p className="text-gray-500 text-xs">Expiry</p>
              <p className="font-medium ">
                {formatDate(data.header.expiryDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t font-semibold border-gray-100 flex justify-between items-center text-sm">
          <span>
            Customer : {data.header.customerName} • Product :{" "}
            {data.header.productName}
          </span>
          <span>Created {formatDate(data.header.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
