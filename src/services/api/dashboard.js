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

export async function getPlanningYearly(year) {
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

export async function getDashboardSummary() {
  const url = `${BASE_URL}/dashboard/summary`;
  const response = await _fetchWithAuth(url);
  const responseJson = await response.json();
  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Gagal mengambil data summary");
  }
  return {
    status,
    message,
    data,
  };
}

export async function getLogHistory({
  page = 1,
  limit = 50,
  action,
  table,
  userId,
  startDate,
  endDate,
  search,
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (action) params.append("action", action);
  if (table) params.append("table", table);
  if (userId) params.append("userId", userId);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (search) params.append("search", search);

  const url = `${BASE_URL}/dashboard/log-history?${params.toString()}`;
  const response = await _fetchWithAuth(url);
  const responseJson = await response.json();

  const { status, message, data, pagination } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Gagal mengambil log history");
  }

  return {
    status,
    message,
    data,
    pagination,
  };
}

export default {
  getLotProgress,
  getPlanningYearly,
  getLogHistory,
  getDashboardSummary,
};
