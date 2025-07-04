import * as React from "react";
import PropTypes from "prop-types";

// Fungsi mapping data backend ke format template print
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

const ComponentToPrint = React.forwardRef((props, ref) => {
  const { data } = props;
  const certificateData = mapBackendToCertificateData(data);
  const rowRefs = React.useRef([]);

  // Hapus console.log(data);

  React.useEffect(() => {
    if (!certificateData || !certificateData.testItems) return;
    rowRefs.current.forEach((row) => {
      if (row) row.style.height = "auto";
    });

    // Hitung tinggi maksimal setiap baris
    const heights = rowRefs.current.map((row) => (row ? row.offsetHeight : 0));
    heights.forEach((h, idx) => {
      if (rowRefs.current[idx])
        rowRefs.current[idx].style.height = `${Math.max(...heights, 32)}px`;
    });
  }, [certificateData]);

  // CSS untuk margin khusus saat print dan mencegah halaman kosong
  React.useEffect(() => {
    // Buat style tag untuk margin print dan mencegah page break
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

  // Render baris testItems dengan sinkronisasi tinggi
  const renderTestRows = () => {
    if (!certificateData || !certificateData.testItems) return null;
    if (certificateData.testItems.length === 0) {
      return (
        <div className="flex flex-row w-full min-h-[32px]">
          <div
            className="border-b border-r border-black px-2 flex items-center w-1/6 break-words"
            style={{ wordBreak: "break-word" }}
          >
            -
          </div>
          <div
            className="border-b border-r border-black px-2 flex items-center justify-center w-1/6 text-center break-words"
            style={{ wordBreak: "break-word" }}
          >
            -
          </div>
          <div
            className="border-b border-r border-black px-2 flex items-center justify-center w-1/6 text-center break-words"
            style={{ wordBreak: "break-word" }}
          >
            -
          </div>
          <div className="flex items-center w-1/2 px-2">
            <h1>{certificateData.remarks}</h1>
          </div>
        </div>
      );
    }
    return certificateData.testItems.map((item, idx) => (
      <div
        key={idx}
        ref={(el) => (rowRefs.current[idx] = el)}
        className="flex flex-row w-full"
        style={{ minHeight: 32 }}
      >
        <div
          className="border-b border-r border-black px-2 flex items-center w-1/6 break-words"
          style={{ wordBreak: "break-word" }}
        >
          {item.parameter || "-"}
        </div>
        <div
          className="border-b border-r border-black px-2 flex items-center justify-center w-1/6 text-center break-words"
          style={{ wordBreak: "break-word" }}
        >
          {item.standard || "-"}
        </div>
        <div
          className="border-b border-r border-black px-2 flex items-center justify-center w-1/6 text-center break-words"
          style={{ wordBreak: "break-word" }}
        >
          {item.result || "-"}
        </div>
        {/* Remarks hanya di baris pertama, sisanya kosong */}
        {idx === 0 ? (
          <div
            className="flex items-center w-1/2 px-2"
            style={{ minHeight: 32 }}
          >
            <h1>{certificateData.remarks}</h1>
          </div>
        ) : (
          <div className="w-1/2 px-2" />
        )}
      </div>
    ));
  };

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
      style={{ display: "block", visibility: "visible" }}
    >
      <div className="border-2 w-full flex flex-col border-black min-h-0 avoid-break">
        <div className="flex flex-col items-center justify-center text-center py-4 border-b border-black avoid-break">
          <h1 className="text-xl font-bold">CERTIFICATE of ANALYSIS</h1>
        </div>
        {/* Table diganti dengan flex layout */}
        <div className="flex f-full flex-col border-b text-sm border-black w-full avoid-break">
          {/* Header dokumen */}
          <div className="flex w-full flex-row text-[8px]">
            <div className="border-b border-r text-start border-black px-1 w-1/6 flex items-center">
              No. Dokument: {certificateData.noDucument}
            </div>
            <div className="border-b border-r border-black px-1 w-1/3 flex items-center">
              Tanggal terbit: {certificateData.tanggalTerbit}
            </div>
            <div className="border-b border-r border-black px-1 w-1/4 flex items-center">
              Status Revisi: {certificateData.statusRevisi}
            </div>
            <div className="border-b border-black px-1 w-1/4 flex items-center">
              Hal: {certificateData.pageInfo}
            </div>
          </div>
          {/* Customer Name */}
          <div className="flex flex-row">
            <div className="border-b border-r border-black px-2 py-2 flex items-center w-1/6">
              CUSTOMER NAME
            </div>
            <div
              className="border-b border-black px-2 flex-1 flex justify-center items-center"
              style={{ minWidth: 0 }}
            >
              <h1 className="font-semibold text-xl">
                {certificateData.customerName}
              </h1>
            </div>
          </div>
          {/* Product Name */}
          <div className="flex flex-row">
            <div className="border-b border-r border-black px-2 py-2 flex items-center w-1/6">
              PRODUCT NAME
            </div>
            <div
              className="border-b border-black px-2 flex-1 flex justify-center items-center"
              style={{ minWidth: 0 }}
            >
              <h1 className="font-semibold text-xl">
                {certificateData.productName}
              </h1>
            </div>
          </div>
          {/* Header kolom test */}
          <div className="flex flex-row">
            <div className="border-b border-r text-center border-black px-2 w-1/6 flex items-center justify-center ">
              ITEM
            </div>
            <div className="border-b border-r text-center border-black px-2 w-1/6 flex items-center justify-center">
              STANDARD
            </div>
            <div className="border-b border-r text-center border-black px-2 w-1/6 flex items-center justify-center">
              RESULT
            </div>
            <div className=" text-center px-2 w-1/2 flex items-center justify-center">
              REMARKS
            </div>
          </div>
          {/* Data testItems sinkron tinggi */}
          <div className="w-full flex flex-col">{renderTestRows()}</div>
          {/* Info tambahan: LOT NO, ISSUED BY, APPROVED BY */}
          <div className="flex mb-50 flex-row">
            {/* LOT NO dan value */}
            <div className="flex flex-col w-1/2">
              <div className="flex flex-row">
                <div className="border-r border-black px-2 font-bold flex items-center w-1/3">
                  LOT NO
                </div>
                <div
                  className="px-2 flex-1 flex items-center"
                  style={{ minWidth: 0 }}
                >
                  {certificateData.lotNo}
                </div>
              </div>
              <div className="flex flex-row">
                <div className="border-t border-r border-black px-2 font-bold flex items-center w-1/3">
                  QUANTITY
                </div>
                <div
                  className="border-t border-black px-2 flex-1 flex items-center"
                  style={{ minWidth: 0 }}
                >
                  {certificateData.quantity} KG
                </div>
              </div>
              <div className="flex flex-row">
                <div className="border-t border-r border-black px-2 font-bold flex items-center w-1/3">
                  MFG DATE
                </div>
                <div
                  className="border-t border-black px-2 flex-1 flex items-center"
                  style={{ minWidth: 0 }}
                >
                  {certificateData.mfgDate && certificateData.mfgDate !== "-"
                    ? new Date(certificateData.mfgDate).toLocaleDateString(
                        "id-ID"
                      )
                    : "-"}
                </div>
              </div>
              <div className="flex flex-row">
                <div className="border-t border-r border-black px-2 font-bold flex items-center w-1/3">
                  EXP DATE
                </div>
                <div
                  className="border-t border-black px-2 flex-1 flex items-center"
                  style={{ minWidth: 0 }}
                >
                  {certificateData.expDate && certificateData.expDate !== "-"
                    ? new Date(certificateData.expDate).toLocaleDateString(
                        "id-ID"
                      )
                    : "-"}
                </div>
              </div>
              <div className="flex flex-row">
                <div className="border-t border-r border-b border-black px-2 font-bold flex items-center w-1/3">
                  DATE
                </div>
                <div
                  className="border-t border-b border-black px-2 flex-1 flex items-center"
                  style={{ minWidth: 0 }}
                >
                  {certificateData.date && certificateData.date !== "-"
                    ? new Date(certificateData.date).toLocaleDateString("id-ID")
                    : "-"}
                </div>
              </div>
            </div>
            {/* ISSUED BY & APPROVED BY (TTD dan Nama) */}
            {/* Tata letak ttd diperbaiki agar border menyambung dengan tabel lain */}
            <div className="flex flex-col border-b border-black w-1/2">
              <div className="flex flex-row h-full">
                <div
                  className="flex flex-col items-center justify-end w-1/2 border-t border-l border-black pb-5"
                  style={{ minHeight: "100px" }}
                >
                  <span className="font-bold text-xs">ISSUED BY</span>
                  <div className="h-8" /> {/* ruang tanda tangan */}
                  <span className="font-semibold text-xs mt-5">
                    {certificateData.issuedBy}
                  </span>
                </div>
                <div
                  className="flex flex-col items-center justify-end w-1/2 border-t border-l border-black pb-5"
                  style={{ minHeight: "100px" }}
                >
                  <span className="font-bold text-xs">APPROVED BY</span>
                  <div className="h-8" /> {/* ruang tanda tangan */}
                  <span className="font-semibold text-xs mt-5">
                    {certificateData.approvedBy}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ComponentToPrint.displayName = "ComponentToPrint";

ComponentToPrint.propTypes = {
  data: PropTypes.shape({
    documentNumber: PropTypes.string,
    issueDate: PropTypes.string,
    revisionStatus: PropTypes.string,
    pageInfo: PropTypes.string,
    customerName: PropTypes.string,
    costumerName: PropTypes.string,
    productName: PropTypes.string,
    testItems: PropTypes.arrayOf(
      PropTypes.shape({
        parameter: PropTypes.string,
        standard: PropTypes.string,
        result: PropTypes.string,
      })
    ),
    lotNo: PropTypes.string,
    lotNumber: PropTypes.string,
    quantity: PropTypes.string,
    mfgDate: PropTypes.string,
    expDate: PropTypes.string,
    expiryDate: PropTypes.string,
    shelfLifeDate: PropTypes.string,
    date: PropTypes.string,
    analysisDate: PropTypes.string,
    issuedBy: PropTypes.string,
    approvedBy: PropTypes.string,
    remarks: PropTypes.string,
  }),
};

export default ComponentToPrint;
