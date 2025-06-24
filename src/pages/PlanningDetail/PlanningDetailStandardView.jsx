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

export default function PlanningDetailStandardView({
  open,
  onClose,
  qcDetail = [],
}) {
  return (
    <Dialog open={open} onClose={onClose} title="Detail Standar QC">
      <DialogContent>
        <DialogTitle>Standard Check</DialogTitle>
        <div style={{ minWidth: 400 }}>
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
                  <TableCell>{qc.property_name}</TableCell>
                  <TableCell>{qc.actual}</TableCell>
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
                    style={{
                      color: qc.result === "Passed" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {qc.result}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div style={{ marginTop: 16, textAlign: "right" }}>
            <Button onClick={onClose}>Tutup</Button>
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
