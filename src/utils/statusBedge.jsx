import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, FileEdit } from "lucide-react";

export const getStatusBadge = (status) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-500 shadow-lg cursor-pointer hover:bg-green-600">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      );
    case "draft":
      return (
        <Badge className="bg-red-500/50 shadow-lg cursor-pointer hover:bg-red-600">
          <FileEdit className="mr-1 h-3 w-3" />
          Draft
        </Badge>
      );
    case "need_approval":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-500 shadow-lg cursor-pointer hover:bg-yellow-600"
        >
          <Clock className="mr-1 h-3 w-3" /> Need Approval
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="text-gray-500 shadow-lg cursor-pointer border-gray-500"
        >
          <Clock className="mr-1 h-3 w-3" /> Unknown
        </Badge>
      );
  }
};
