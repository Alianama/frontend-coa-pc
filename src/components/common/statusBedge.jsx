import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, FileEdit, AlertCircle } from "lucide-react";

/**
 * Fungsi utilitas untuk menghasilkan Badge dengan style dan icon sesuai tipe/status/value.
 * @param {Object} options
 * @param {string} options.value - Nilai status/role/tipe yang ingin ditampilkan.
 * @param {string} [options.type] - Jenis badge (misal: status, role, product, planning, visualCheck, odor, colorCheck, qcJudgment, dsb).
 * @param {React.ReactNode} [options.icon] - Icon custom opsional.
 * @param {string} [options.className] - Kelas tambahan opsional.
 * @returns {JSX.Element}
 */
export function getBadge({ value, type = "status", icon, className = "" }) {
  // Mapping style dan label
  const config = {
    status: {
      printed: {
        label: "Printed",
        className: "bg-purple-500 text-white hover:bg-purple-600",
        icon: <CheckCircle2 className="mr-1 h-3 w-3" />,
      },
      approved: {
        label: "Approved",
        className: "bg-green-500 hover:bg-green-600 text-white",
        icon: <CheckCircle2 className="mr-1 h-3 w-3" />,
      },
      draft: {
        label: "Draft",
        className: "bg-red-500/50 hover:bg-red-600",
        icon: <FileEdit className="mr-1 h-3 w-3" />,
      },
      need_approval: {
        label: "Need Approval",
        className: "bg-yellow-500 hover:bg-yellow-600",
        icon: <Clock className="mr-1 h-3 w-3" />,
        variant: "outline",
      },
      default: {
        label: value || "Unknown",
        className: "text-gray-500 border-gray-500",
        icon: <Clock className="mr-1 h-3 w-3" />,
        variant: "outline",
      },
    },
    planning: {
      open: {
        label: "Open",
        className: "bg-red-100 text-red-800 border border-red-300",
      },
      progress: {
        label: "Progress",
        className: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      },
      close: {
        label: "Close",
        className: "bg-green-100 text-green-800 border border-green-300",
      },
      default: {
        label: value,
        className: "border border-gray-300 text-gray-700 bg-gray-50",
      },
    },
    product: {
      active: {
        label: "Active",
        className: "bg-green-100 text-green-800 border border-green-300",
      },
      draft: {
        label: "Draft",
        className: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      },
      default: {
        label: value,
        className: "border border-gray-300 text-gray-700 bg-gray-50",
      },
    },
    visualCheck: {
      PASS: {
        label: "PASS",
        className:
          "bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      },
      NG: {
        label: "NG",
        className:
          "bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
      },
      default: {
        label: value,
        className: "border border-gray-300 text-gray-700 bg-gray-50",
      },
    },
    odor: {
      empty: {
        label: "EMPTY",
        className:
          "bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      },
      PASS: {
        label: "PASS",
        className:
          "bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      },
      NG: {
        label: "NG",
        className:
          "bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
      },
      default: {
        label: value,
        className: "border border-gray-300 text-gray-700 bg-gray-50",
      },
    },
    dispersibility: {
      empty: {
        label: "EMPTY",
        className:
          "bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      },
      PASS: {
        label: "PASS",
        className:
          "bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      },
      NG: {
        label: "NG",
        className:
          "bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
      },
      default: {
        label: value,
        className: "border border-gray-300 text-gray-700 bg-gray-50",
      },
    },
    pelletVisual: {
      empty: {
        label: "EMPTY",
        className:
          "bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      },
      PASS: {
        label: "PASS",
        className:
          "bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      },
      NG: {
        label: "NG",
        className:
          "bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
      },
      default: {
        label: value,
        className: "border border-gray-300 text-gray-700 bg-gray-50",
      },
    },
    colorCheck: {
      PASS: {
        label: "PASS",
        className:
          "bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      },
      NG: {
        label: "NG",
        className:
          "bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
      },
      default: {
        label: value,
        className: "border border-gray-300 text-gray-700 bg-gray-50",
      },
    },
    qcJudgment: {
      Passed: {
        label: "PASS",
        className:
          "bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      },
      NG: {
        label: "NG",
        className:
          "bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 px-1 py-0.5 text-xs",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
      },
      default: {
        label: value,
        className: "border border-gray-300 text-gray-700 bg-gray-50",
      },
    },
    role: {
      SUPER_ADMIN: {
        label: "SUPERADMIN",
        className: "bg-red-100 text-red-800 border border-red-300",
        variant: "destructive",
      },
      ADMIN: {
        label: "ADMIN",
        className: "bg-blue-100 text-blue-800 border border-blue-300",
        variant: "default",
      },
      USER: {
        label: "USER",
        className: "bg-gray-100 text-gray-800 border border-gray-300",
        variant: "secondary",
      },
      default: {
        label: value,
        className: "border border-gray-300 text-gray-700 bg-gray-50",
        variant: "outline",
      },
    },
    // Tambah mapping lain sesuai kebutuhan
  };

  const typeConfig = config[type] || config.status;
  const badgeConfig = typeConfig[value] || typeConfig.default;
  const badgeIcon = icon !== undefined ? icon : badgeConfig.icon;
  const badgeVariant = badgeConfig.variant || "outline";

  return (
    <Badge
      variant={badgeVariant}
      className={badgeConfig.className + (className ? ` ${className}` : "")}
    >
      {badgeIcon}
      {badgeConfig.label}
    </Badge>
  );
}
