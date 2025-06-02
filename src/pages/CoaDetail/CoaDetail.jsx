import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetDetailCOA } from "@/store/coa/action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle,
  Shield,
  Edit3,
  Printer,
  Trash2,
  AlertTriangle,
  Plus,
  Download,
} from "lucide-react";
import { getStatusBadge } from "@/components/common/statusBedge";
import { formatDate } from "@/utils/formatDate";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const DataCell = ({ value, isMissing = false, unit = "" }) => (
  <TableCell className="font-medium">
    {isMissing ? (
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span className="text-amber-600 font-medium">Missing Data</span>
      </div>
    ) : (
      <span className="text-gray-900">
        {value || "-"} {unit}
      </span>
    )}
  </TableCell>
);

const SectionHeader = ({
  title,
  icon,
  hasIncompleteData = false,
  hasPendingApprove = null,
}) => (
  <TableRow className="bg-secondary/90">
    <TableCell colSpan={2} className="font-bold text-gray-800 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1 bg-yellow-100 rounded-lg text-yellow-700">
            {icon}
          </div>
          <span className="text-sm">{title}</span>
        </div>
        {hasPendingApprove !== null &&
          (hasPendingApprove ? (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">
                Approved
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-amber-600 font-medium">
                Pending Approved
              </span>
            </div>
          ))}
        {hasIncompleteData && (
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-amber-600 font-medium">
              Incomplete Data
            </span>
          </div>
        )}
      </div>
    </TableCell>
  </TableRow>
);

export default function COADetail() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detail_coa: data } = useSelector((state) => state.coa);

  useEffect(() => {
    if (id) {
      dispatch(asyncGetDetailCOA(id));
    }
  }, [dispatch, id]);

  const checkDataCompleteness = () => {
    if (!data)
      return {
        completedFields: 0,
        totalFields: 0,
        completionPercentage: 0,
        isComplete: false,
      };

    const requiredFields = [
      data.costumerName,
      data.productName,
      data.letDownResin,
      data.lotNumber,
      data.quantity,
      data.pelletSize,
      data.pelletVisual,
      data.color,
      data.status,
      data.dispersibility,
      data.mfr,
      data.density,
      data.moisture,
      data.carbonContent,
      data.intrinsicViscosity,
      data.ashContent,
      data.foreignMatter,
      data.weightOfChips,
    ];

    const completedFields = requiredFields.filter(
      (field) =>
        field !== null && field !== undefined && field.toString().trim() !== ""
    ).length;
    const totalFields = requiredFields.length;
    const completionPercentage = Math.round(
      (completedFields / totalFields) * 100
    );

    return {
      completedFields,
      totalFields,
      completionPercentage,
      isComplete: completionPercentage === 100,
    };
  };

  const completeness = checkDataCompleteness();

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log("Edit COA data");
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const printStyles = `
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
        }
      `;
      const styleSheet = document.createElement("style");
      styleSheet.textContent = printStyles;
      document.head.appendChild(styleSheet);

      setTimeout(() => {
        window.print();
        document.head.removeChild(styleSheet);
        setIsPrinting(false);
      }, 500);
    } catch (error) {
      console.error("Print error:", error);
      setIsPrinting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // TODO: Implement delete functionality
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("COA deleted");
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export COA to PDF");
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading COA data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 print-area">
      <motion.div
        className="max-w-6xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Action Bar */}
        <motion.div variants={itemVariants} className="no-print">
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      COA Detail - {data.lotNumber}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">
                        Data Completeness:
                      </span>
                      <Progress
                        value={completeness.completionPercentage}
                        className="w-24 h-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {completeness.completionPercentage}%
                      </span>
                    </div>
                  </div>

                  {!completeness.isComplete && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-800 border border-amber-300"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Incomplete Data
                    </Badge>
                  )}
                  {getStatusBadge(data.status)}
                </div>

                <div className="border-l border-gray-200 pl-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleEdit}
                      disabled={data.status === "approved"}
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {completeness.isComplete ? "Edit" : "Complete Data"}
                    </Button>

                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      size="sm"
                      disabled={data.status !== "approved" || isPrinting}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      {isPrinting ? "Printing..." : "Print"}
                    </Button>

                    <Button
                      onClick={handleExport}
                      variant="outline"
                      size="sm"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          disabled={data.status === "approved"}
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-secondary">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Certificate of Analysis
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this COA? This
                            action cannot be undone and will permanently remove
                            the certificate and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete COA"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Completeness Alert */}
        {!completeness.isComplete && (
          <motion.div variants={itemVariants} className="no-print">
            <Card className="border border-amber-200 shadow-sm bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-800 mb-1">
                      Incomplete Data Detected
                    </h3>
                    <p className="text-sm text-amber-700 mb-3">
                      This COA is missing{" "}
                      {completeness.totalFields - completeness.completedFields}{" "}
                      required fields. Please complete all data before final
                      approval.
                    </p>
                    <Button
                      onClick={handleEdit}
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Complete Missing Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main COA Table */}
        <motion.div variants={itemVariants}>
          <Card className="border border-gray-200 shadow-lg bg-white overflow-hidden">
            {/* Main Data Table */}
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 border-b-2 border-gray-200">
                    <TableHead className="font-bold text-gray-800 w-1/3">
                      Parameter
                    </TableHead>
                    <TableHead className="font-bold text-gray-800">
                      Value / Result
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Document Information */}
                  <SectionHeader
                    title="Document Information"
                    icon={<Shield className="w-5 h-5" />}
                  />
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Status
                    </TableCell>
                    <DataCell
                      value={getStatusBadge(data.status)}
                      isMissing={!data.status}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Lot Number
                    </TableCell>
                    <DataCell
                      value={data.lotNumber}
                      isMissing={!data.lotNumber}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Customer Name
                    </TableCell>
                    <DataCell
                      value={data.costumerName}
                      isMissing={!data.costumerName}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Product Name
                    </TableCell>
                    <DataCell
                      value={data.productName}
                      isMissing={!data.productName}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Let Down Resin
                    </TableCell>
                    <DataCell
                      value={data.letDownResin}
                      isMissing={!data.letDownResin}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Quantity
                    </TableCell>
                    <DataCell
                      value={data.quantity}
                      unit="kg"
                      isMissing={!data.quantity}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Color
                    </TableCell>
                    <DataCell value={data.color} isMissing={!data.color} />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Pellet Size
                    </TableCell>
                    <DataCell
                      value={data.pelletSize}
                      isMissing={!data.pelletSize}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Pellet Visual
                    </TableCell>
                    <DataCell
                      value={data.pelletVisual}
                      isMissing={!data.pelletVisual}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Dispersibility
                    </TableCell>
                    <DataCell
                      value={data.dispersibility}
                      isMissing={!data.dispersibility}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Foreign Matter
                    </TableCell>
                    <DataCell
                      value={data.foreignMatter}
                      isMissing={!data.foreignMatter}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Weight of Chips
                    </TableCell>
                    <DataCell
                      value={data.weightOfChips}
                      isMissing={!data.weightOfChips}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      MFR (Melt Flow Rate)
                    </TableCell>
                    <DataCell value={data.mfr} isMissing={!data.mfr} />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Density
                    </TableCell>
                    <DataCell value={data.density} isMissing={!data.density} />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Moisture Content
                    </TableCell>
                    <DataCell
                      value={data.moisture}
                      isMissing={!data.moisture}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Carbon Content
                    </TableCell>
                    <DataCell
                      value={data.carbonContent}
                      isMissing={!data.carbonContent}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Ash Content
                    </TableCell>
                    <DataCell
                      value={data.ashContent}
                      isMissing={!data.ashContent}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Intrinsic Viscosity
                    </TableCell>
                    <DataCell
                      value={data.intrinsicViscosity}
                      isMissing={!data.intrinsicViscosity}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Manufacturing Date
                    </TableCell>
                    <DataCell
                      value={formatDate(data.mfgDate)}
                      isMissing={!data.mfgDate}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Analysis Date
                    </TableCell>
                    <DataCell
                      value={formatDate(data.analysisDate)}
                      isMissing={!data.analysisDate}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Printed Date
                    </TableCell>
                    <DataCell
                      value={formatDate(data.printedDate)}
                      isMissing={!data.printedDate}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Expiry Date
                    </TableCell>
                    <DataCell
                      value={formatDate(data.expiryDate)}
                      isMissing={!data.expiryDate}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Issued By
                    </TableCell>
                    <DataCell value={data.issueBy} isMissing={!data.issueBy} />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Approved By
                    </TableCell>
                    <DataCell
                      value={data.approvedBy || ""}
                      isMissing={!data.approvedBy}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Created At
                    </TableCell>
                    <DataCell
                      value={formatDate(data.createdAt)}
                      isMissing={!data.createdAt}
                    />
                  </TableRow>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700 pl-6">
                      Last Updated
                    </TableCell>
                    <DataCell
                      value={formatDate(data.updatedAt)}
                      isMissing={!data.updatedAt}
                    />
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>

            {/* Footer */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-yellow-50/30 border-t border-gray-200">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <p className="text-sm font-semibold text-gray-800">
                    This certificate is issued in accordance with ISO/IEC
                    17025:2017 standards
                  </p>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-2">
                  <span className="text-xs text-gray-500">
                    Lot Number : {data.lotNumber.toString().padStart(6, "0")}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
