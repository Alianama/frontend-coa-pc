import React from "react";
import PropTypes from "prop-types";

const ComponentToPrintTable = React.forwardRef(({ data }, ref) => {
  // Tambahkan efek untuk menerapkan margin print custom seperti di TampletePrint1.jsx
  React.useEffect(() => {
    // Cek apakah style sudah ada
    if (document.getElementById("custom-print-margin-style")) return;
    const style = document.createElement("style");
    style.type = "text/css";
    style.id = "custom-print-margin-style";
    style.innerHTML = `
      @media print {
        html, body {
          height: auto !important;
          min-height: 0 !important;
        }
        body {
          margin: 35mm 10mm 10mm 10mm !important;
        }
        .custom-print-margin {
          margin: 0 !important;
        }
        .avoid-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .no-page-break {
          page-break-before: avoid !important;
          page-break-after: avoid !important;
        }
        .print-content {
          page-break-after: avoid !important;
          page-break-before: avoid !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup saat unmount
    return () => {
      const exist = document.getElementById("custom-print-margin-style");
      if (exist) {
        exist.parentNode.removeChild(exist);
      }
    };
  }, []);

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
      analysisDate: data.analysisDate || data.date || "-",
      issuedBy: data.issuedBy || "-",
      approvedBy: data.approvedBy || "-",
      resin: data.resin || "-",
      moulding: data.moulding || "-",
      letDownRatio: data.letDownRatio || "_",
      dispersibility: data.dispersibility || "-",
      pelletVisual: data.pelletVisual || "-",
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
      className="w-full flex flex-col mx-auto  bg-white text-black print:p-2 print:max-w-none custom-print-margin avoid-break"
      style={{ fontFamily: "Arial, sans-serif", fontSize: 14 }}
    >
      {/* Header dokumen */}
      <div className="border pt-5 border-black ">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold mb-4">CERTIFICATE of ANALYSIS</h1>
        </div>
        <div className="flex flex-row  text-[10px] justify-between border border-black border-r-0 border-l-0 px-2 mb-10 ">
          <div className="flex-1 text-center py-1">
            No. Dokumen: {certificateData.noDucument}
          </div>
          <div className="flex-1 border-l border-black text-center py-1">
            Tanggal Efektif: {certificateData.tanggalTerbit}
          </div>
          <div className="flex-1 border-l border-black text-center py-1">
            Status Revisi: {certificateData.statusRevisi}
          </div>
          <div className="flex-1 border-l border-black text-center py-1">
            Hal: 1 dari 1
          </div>
        </div>
        {/* Data Customer & Produk */}
        <div className="flex px-10 flex-row mb-5">
          <div className="w-40 font-bold">Customer Name</div>
          <div className="w-4">:</div>
          <div className="flex-1 font-bold">{certificateData.customerName}</div>
        </div>
        <div className="px-10 ">
          <div className="flex gap-15 text-[12px]">
            <div className="mb-10 pr-10 border-black">
              <div className="flex flex-row mb-1">
                <div className="w-40">Product Name</div>
                <div className="w-4">:</div>
                <div className="flex-1">{certificateData.productName}</div>
              </div>
              <div className="flex flex-row mb-1">
                <div className="w-40">Lot Number</div>
                <div className="w-4">:</div>
                <div className="flex-1">{certificateData.lotNo}</div>
              </div>
              <div className="flex flex-row mb-1">
                <div className="w-40">Resin</div>
                <div className="w-4">:</div>
                <div className="flex-1">{certificateData.resin}</div>
              </div>
              <div className="flex flex-row mb-1">
                <div className="w-40">Quantity</div>
                <div className="w-4">:</div>
                <div className="flex-1">{certificateData.quantity} Kg</div>
              </div>
            </div>
            <div className="mb-10">
              <div className="flex flex-row mb-1">
                <div className="w-40">Moulding</div>
                <div className="w-4">:</div>
                <div className="flex-1">{certificateData.moulding}</div>
              </div>
              <div className="flex flex-row mb-1">
                <div className="w-40">Let Down Ratio</div>
                <div className="w-4">:</div>
                <div className="flex-1">{certificateData.letDownRatio}</div>
              </div>
              <div className="flex flex-row mb-1">
                <div className="w-40">Mfg Date</div>
                <div className="w-4">:</div>
                <div className="flex-1">
                  {certificateData.mfgDate
                    ? new Date(certificateData.mfgDate).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "-"}
                </div>
              </div>
              <div className="flex flex-row mb-1">
                <div className="w-40">Exp Date</div>
                <div className="w-4">:</div>
                <div className="flex-1">
                  {certificateData.expDate
                    ? new Date(certificateData.expDate).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "-"}
                </div>
              </div>
              <div className="flex flex-row mb-1">
                <div className="w-40">Analysis Date</div>
                <div className="w-4">:</div>
                <div className="flex-1">
                  {certificateData.analysisDate
                    ? new Date(certificateData.analysisDate).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "-"}
                </div>
              </div>
            </div>
          </div>

          <table
            className="w-full text-center text-sm "
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th className="border border-black p-1">Properties</th>
                <th className="border border-black p-1">Specification</th>
                <th className="border border-black p-1">Unit</th>
                <th className="border border-black p-1">Result</th>
              </tr>
            </thead>
            <tbody>
              {certificateData.testItems &&
              certificateData.testItems.length > 0 ? (
                certificateData.testItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border text-[12px] py-1 border-black">
                      {item.parameter || "-"}
                    </td>
                    <td className="border text-[12px] py-1 border-black">
                      {item.specification || "-"}
                    </td>
                    <td className="border text-[12px] py-1 border-black">
                      {item.unit || "-"}
                    </td>
                    <td className="border text-[12px] py-1 border-black">
                      {item.result
                        ? item.result === "Pass"
                          ? "PASS"
                          : item.result
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border border-black ">-</td>
                  <td className="border border-black ">-</td>
                  <td className="border border-black ">-</td>
                </tr>
              )}
            </tbody>
          </table>
          <h1 className="text-[11px] pt-5">
            *Notes : {certificateData.remarks}{" "}
          </h1>
          <div className="flex flex-row justify-end mt-40 mb-10">
            <div className="w-1/2" />
            <div className="flex flex-row gap-4 w-1/3">
              <div className="flex flex-col items-center w-1/2">
                <div>Issue by :</div>
                <div className="mt-20 mb-1 w-32 " />
                <div className="font-semibold border-b text-center border-black min-w-20">
                  {certificateData.issuedBy || "__________"}
                </div>
              </div>
              <div className="flex flex-col items-center w-1/2">
                <div>Approved by :</div>
                <div className="mt-20 mb-1 w-32 " />
                <div className="font-semibold border-b text-center border-black min-w-20">
                  {certificateData.approvedBy || "__________"}
                </div>
              </div>
            </div>
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
