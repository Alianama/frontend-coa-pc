import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/table";
import PropTypes from "prop-types";

// Fungsi utilitas untuk memformat nama property
// function formatPropertyName(name) {
//   return name
//     .replace(/([A-Z])/g, " $1")
//     .replace(/([0-9]+)/g, " $1")
//     .replace(/^./, (str) => str.toUpperCase())
//     .trim();
// }

export default function PlanningDetailStandardView({
  open,
  onClose,
  qcDetail = [],
}) {
  return (
    <Dialog
      className="w-10/12"
      open={open}
      onClose={onClose}
      title="Detail Standar QC"
    >
      <DialogContent>
        <DialogTitle className="text-xl font-bold mb-4">
          Standard Check
        </DialogTitle>
        {/* 
          Tambahkan max-h dan overflow-y-auto pada wrapper tabel agar bisa di-scroll
          ketika data banyak.
        */}
        <div className="overflow-x-auto">
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Actual</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Tolerance</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qcDetail.map((qc, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      {qc.property_name}
                    </TableCell>
                    <TableCell>
                      {typeof qc.actual === "number"
                        ? qc.actual.toFixed(2)
                        : qc.actual}
                    </TableCell>
                    <TableCell>{qc.target_value}</TableCell>
                    <TableCell>
                      {qc.tolerance !== null ? qc.tolerance : "-"}
                    </TableCell>
                    <TableCell>
                      {qc.operator === "PLUS_MINUS" && "±"}
                      {qc.operator === "LESS_THAN" && "<"}
                      {qc.operator === "LESS_EQUAL" && "≤"}
                      {qc.operator === "GREATER_THAN" && ">"}
                      {qc.operator === "GREATER_EQUAL" && "≥"}
                      {![
                        "PLUS_MINUS",
                        "LESS_THAN",
                        "LESS_EQUAL",
                        "GREATER_THAN",
                        "GREATER_EQUAL",
                      ].includes(qc.operator) && qc.operator}
                    </TableCell>
                    <TableCell
                      className={`font-bold ${
                        qc.result === "Passed"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {qc.result}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={onClose} className="px-6">
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

PlanningDetailStandardView.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  qcDetail: PropTypes.arrayOf(
    PropTypes.shape({
      property_name: PropTypes.string.isRequired,
      actual: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      target_value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      tolerance: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.oneOf([null]),
      ]),
      operator: PropTypes.string,
      unit: PropTypes.string,
      result: PropTypes.string,
    })
  ),
};
