import { _fetchWithAuth, BASE_URL } from "./client";

export async function getLotProgress(startDate, endDate) {
  // Jika kosong, set ke undefined
  startDate = startDate ? startDate : undefined;
  endDate = endDate ? endDate : undefined;

  const params = new URLSearchParams();
  // Hanya tambahkan param jika TIDAK undefined
  if (typeof startDate !== "undefined") params.append("startDate", startDate);
  if (typeof endDate !== "undefined") params.append("endDate", endDate);

  const queryString = params.toString();
  const url = queryString
    ? `${BASE_URL}/dashboard/lot-progress?${queryString}`
    : `${BASE_URL}/dashboard/lot-progress`;

  const response = await _fetchWithAuth(url);
  const responseJson = await response.json();

  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Get Lot Progress Failed");
  }

  return {
    status,
    message,
    data,
  };
}

// Fungsi untuk mengambil data total planning per bulan dalam satu tahun
export async function getPlanningYearly(year) {
  // year wajib diisi, default ke tahun sekarang jika tidak ada
  const tahun = year || new Date().getFullYear();
  const params = new URLSearchParams();
  params.append("year", tahun);

  const url = `${BASE_URL}/dashboard/total-planning-perbulan?${params.toString()}`;

  const response = await _fetchWithAuth(url);
  const responseJson = await response.json();

  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Gagal mengambil data planning per tahun");
  }

  return {
    status,
    message,
    data,
  };
}

export default { getLotProgress, getPlanningYearly };
