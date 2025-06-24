import { BASE_URL, _fetchWithAuth } from "./client";

export async function getPlanning(page = 1, limit = 100, search = "") {
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  if (search) {
    queryParams.append("search", search);
  }
  const url = `${BASE_URL}/planning?${queryParams.toString()}`;
  const response = await _fetchWithAuth(url);
  const responseJson = await response.json();
  if (responseJson.status !== "success")
    throw new Error(responseJson.message || "Gagal ambil planning");
  return {
    status: "success",
    data: responseJson.data,
    pagination: responseJson.pagination,
    message: responseJson.message,
  };
}

export async function createPlanning(planning) {
  const response = await _fetchWithAuth(`${BASE_URL}/planning`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(planning),
  });
  const responseJson = await response.json();
  if (responseJson.status !== "success")
    throw new Error(responseJson.message || "Gagal membuat planning");
  return {
    status: "success",
    data: responseJson.data,
    message: responseJson.message,
  };
}

export async function deletePlanning(planningId) {
  const response = await _fetchWithAuth(`${BASE_URL}/planning/${planningId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const responseJson = await response.json();
  if (responseJson.status !== "success")
    throw new Error(responseJson.message || "Gagal hapus planning");
  return { status: "success", message: responseJson.message };
}

export async function updatePlanning(planningId, planning) {
  const response = await _fetchWithAuth(`${BASE_URL}/planning/${planningId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(planning),
  });
  const responseJson = await response.json();
  if (responseJson.status !== "success")
    throw new Error(responseJson.message || "Gagal update planning");
  return {
    status: "success",
    data: responseJson.data,
    message: responseJson.message,
  };
}

export async function getDetailPlanningByLot(lotNumber) {
  const url = `${BASE_URL}/planning/detail/by-lot/${lotNumber}`;
  const response = await _fetchWithAuth(url);
  const responseJson = await response.json();
  if (responseJson.status !== "success")
    throw new Error(responseJson.message || "Failed get detail planning");
  return {
    status: "success",
    data: responseJson.data,
    totalQtyCheck: responseJson.totalQtyCheck,
    header: responseJson.header,
  };
}

export async function postPlanningDetail(data) {
  const response = await _fetchWithAuth(`${BASE_URL}/planning/detail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    throw new Error(responseJson.message || "Gagal post detail planning");
  }
  return {
    status: responseJson.status,
    message: responseJson.message,
    data: responseJson.data,
  };
}

export async function deletePlanningDetail(detailId) {
  const response = await _fetchWithAuth(
    `${BASE_URL}/planning/detail/${detailId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    throw new Error(responseJson.message || "Gagal hapus detail planning");
  }
  return { status: "success", message: responseJson.message };
}

export async function updatePlanningDetail(detailId, data) {
  const response = await _fetchWithAuth(
    `${BASE_URL}/planning/detail/${detailId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    throw new Error(responseJson.message || "Gagal update detail planning");
  }
  return {
    status: "success",
    message: responseJson.message,
    data: responseJson.data,
  };
}

export async function planningClose(planningId) {
  const response = await _fetchWithAuth(
    `${BASE_URL}/planning/${planningId}/close`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }
  );
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    throw new Error(responseJson.message || "Gagal close planning");
  }
  return {
    status: "success",
    message: responseJson.message,
    data: responseJson.data,
  };
}

export async function planningReOpen(planningId) {
  const response = await _fetchWithAuth(
    `${BASE_URL}/planning/${planningId}/reopen`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }
  );
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    throw new Error(responseJson.message || "Gagal reopen planning");
  }
  return {
    status: "success",
    message: responseJson.message,
    data: responseJson.data,
  };
}
