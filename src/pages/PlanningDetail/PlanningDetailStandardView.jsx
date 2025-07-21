import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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

function getOperator(operator) {
  switch (operator) {
    case "PLUS_MINUS":
      return "±";
    case "LESS_THAN":
      return "<";
    case "LESS_EQUAL":
      return "≤";
    case "GREATER_THAN":
      return ">";
    case "GREATER_EQUAL":
      return "≥";
    default:
      return operator;
  }
}

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
        <DialogTitle className="text-xl font-bold m-0 p-0">
          Standard Check
        </DialogTitle>
        <DialogDescription className="mb-5">
          Detailed standard check compared with actual data
        </DialogDescription>
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
                      {qc.property_name
                        .replace(/([A-Z])/g, " $1")
                        .replace(/([0-9]+)/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                        .trim()}
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
                    <TableCell>{getOperator(qc.operator)}</TableCell>
                    <TableCell
                      className={`font-bold ${
                        qc.result === "Passed"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {qc.result === null || qc.result === ""
                        ? "NG"
                        : qc.result}
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
