import React from "react";
import PropTypes from "prop-types";

const ComponentToPrintTable = React.forwardRef(({ data }, ref) => {
  function mapBackendToCertificateData(data) {
    if (!data) return null;
    return {
      customerName: data.costumerName || data.customerName || "-",
      productName: data.productName || "-",
      remarks: data.remarks || "-",
      testItems: Array.isArray(data.testItems) ? data.testItems : [],
      lotNo: data.lotNumber || data.lotNo || "-",
      quantity: data.quantity || "-",
      mfgDate: data.mfgDate || "-",
      expDate: data.expiryDate || data.expDate || "-",
      date: data.analysisDate || data.date || "-",
      issuedBy: data.issuedBy || "-",
      approvedBy: data.approvedBy || "-",
      documentNumber: data.documentNumber || "-",
      revisionStatus: data.revisionStatus || "-",
      pageInfo: "1 dari 1",
      noDucument: "FRM / III / PC_QC /09",
      tanggalTerbit: "02 Januari 2024",
      statusRevisi: "01",
    };
  }
  const certificateData = mapBackendToCertificateData(data);
  if (!certificateData) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-8">
        <span className="text-gray-500">Data tidak tersedia</span>
      </div>
    );
  }
  return (
    <div
      ref={ref}
      className="w-full flex flex-col mx-auto p-4 bg-white text-black print:p-2 print:max-w-none custom-print-margin avoid-break"
    >
      <div className="border-2 w-full flex flex-col border-black min-h-0 avoid-break">
        <div className="flex flex-col items-center justify-center text-center py-4 border-b border-black avoid-break">
          <h1 className="text-xl font-bold">CERTIFICATE of ANALYSIS</h1>
        </div>
        <table className="w-full border border-black text-sm">
          <tbody>
            <tr className="text-[8px]">
              <td className="border border-black w-1/6">
                No. Dokument: {certificateData.noDucument}
              </td>
              <td className="border border-black w-1/3">
                Tanggal terbit: {certificateData.tanggalTerbit}
              </td>
              <td className="border border-black w-1/4">
                Status Revisi: {certificateData.statusRevisi}
              </td>
              <td className="border border-black w-1/4">
                Hal: {certificateData.pageInfo}
              </td>
            </tr>
            <tr>
              <td className="border border-black w-1/6">Customer</td>
              <td className="border border-black" colSpan={3}>
                {certificateData.customerName}
              </td>
            </tr>
            <tr>
              <td className="border border-black w-1/6">Product</td>
              <td className="border border-black" colSpan={3}>
                {certificateData.productName}
              </td>
            </tr>
            <tr>
              <td className="border border-black w-1/6">Lot No</td>
              <td className="border border-black w-1/6">
                {certificateData.lotNo}
              </td>
              <td className="border border-black w-1/6">Quantity</td>
              <td className="border border-black w-1/2">
                {certificateData.quantity}
              </td>
            </tr>
            <tr>
              <td className="border border-black w-1/6">Mfg Date</td>
              <td className="border border-black w-1/6">
                {certificateData.mfgDate}
              </td>
              <td className="border border-black w-1/6">Exp Date</td>
              <td className="border border-black w-1/2">
                {certificateData.expDate}
              </td>
            </tr>
            <tr>
              <td className="border border-black w-1/6">Date</td>
              <td className="border border-black w-1/6">
                {certificateData.date}
              </td>
              <td className="border border-black w-1/6">Document No</td>
              <td className="border border-black w-1/2">
                {certificateData.documentNumber}
              </td>
            </tr>
          </tbody>
        </table>
        <table className="w-full border border-black text-sm mt-2">
          <thead>
            <tr>
              <th className="border border-black">Parameter</th>
              <th className="border border-black">Standard</th>
              <th className="border border-black">Result</th>
              <th className="border border-black">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {certificateData.testItems &&
            certificateData.testItems.length > 0 ? (
              certificateData.testItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-black">
                    {item.parameter || "-"}
                  </td>
                  <td className="border border-black">
                    {item.standard || "-"}
                  </td>
                  <td className="border border-black">{item.result || "-"}</td>
                  {idx === 0 ? (
                    <td
                      className="border border-black"
                      rowSpan={certificateData.testItems.length}
                    >
                      {certificateData.remarks}
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                <td className="border border-black">-</td>
                <td className="border border-black">-</td>
                <td className="border border-black">-</td>
                <td className="border border-black">
                  {certificateData.remarks}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex flex-row w-full mt-4">
          <div className="w-1/2 text-center">
            <div>Issued By</div>
            <div className="mt-8">{certificateData.issuedBy}</div>
          </div>
          <div className="w-1/2 text-center">
            <div>Approved By</div>
            <div className="mt-8">{certificateData.approvedBy}</div>
          </div>
        </div>
      </div>
    </div>
  );
});
ComponentToPrintTable.displayName = "ComponentToPrintTable";
ComponentToPrintTable.propTypes = {
  data: PropTypes.object,
};

export default ComponentToPrintTable;
