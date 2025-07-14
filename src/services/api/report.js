import { _fetchWithAuth, BASE_URL } from "./client";

// GET /report/excel?startDate=...&endDate=...
export async function getReportExcelByDate(startDate, endDate) {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const url = `${BASE_URL}/report/excel?${params.toString()}`;
  const response = await _fetchWithAuth(url);

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Gagal download report");
  }

  // Ambil nama file dari header
  const disposition = response.headers.get("Content-Disposition");
  let filename = "report.xlsx";
  if (disposition && disposition.includes("filename=")) {
    filename = disposition.split("filename=")[1].replace(/"/g, "");
  }

  // Download file
  const blob = await response.blob();
  const urlBlob = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = urlBlob;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(urlBlob);

  return { success: true, filename };
}

// GET /report/excel?month=...&year=...
export async function getReportExcelByMonthYear(month, year) {
  const params = new URLSearchParams();
  if (month) params.append("month", month);
  if (year) params.append("year", year);

  const url = `${BASE_URL}/report/excel?${params.toString()}`;
  const response = await _fetchWithAuth(url);

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Gagal download report");
  }

  // Ambil nama file dari header
  const disposition = response.headers.get("Content-Disposition");
  let filename = "report.xlsx";
  if (disposition && disposition.includes("filename=")) {
    filename = disposition.split("filename=")[1].replace(/"/g, "");
  }

  // Download file
  const blob = await response.blob();
  const urlBlob = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = urlBlob;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(urlBlob);

  return { success: true, filename };
}

// GET /report/history
export async function getReportHistory() {
  const url = `${BASE_URL}/report/history`;
  const response = await _fetchWithAuth(url);
  const responseJson = await response.json();
  const { status, data, message } = responseJson;
  if (status !== "success") {
    throw new Error(message || "Gagal mengambil history report");
  }
  return data;
}

// GET /report/download/:id
export async function downloadReportById(id) {
  const url = `${BASE_URL}/report/download/${id}`;
  const response = await _fetchWithAuth(url);

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Gagal download file");
  }

  // Ambil nama file dari header
  const disposition = response.headers.get("Content-Disposition");
  let filename = "report.xlsx";
  if (disposition && disposition.includes("filename=")) {
    filename = disposition.split("filename=")[1].replace(/"/g, "");
  }

  // Download file
  const blob = await response.blob();
  const urlBlob = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = urlBlob;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(urlBlob);

  return { success: true, filename };
}

export default {
  getReportExcelByDate,
  getReportExcelByMonthYear,
  getReportHistory,
  downloadReportById,
};
