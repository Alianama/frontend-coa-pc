import { BASE_URL, _fetchWithAuth } from "./client";

export async function getAllPrint(page = 1, limit = 100, search = "") {
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  if (search) {
    queryParams.append("search", search);
  }

  const response = await _fetchWithAuth(
    `${BASE_URL}/print?${queryParams.toString()}`
  );
  const responseJson = await response.json();
  const { status, message, data, pagination } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Get Print list failed");
  }

  return {
    status,
    message,
    data,
    pagination,
  };
}

export async function printCoa(planningId, quantity, remarks) {
  const response = await _fetchWithAuth(`${BASE_URL}/print/${planningId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity, remarks }),
  });
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    throw new Error(responseJson.message || "Failed Print Coa");
  }
  return {
    status: responseJson.status,
    message: responseJson.message,
    data: responseJson.data,
  };
}

export async function approvePrintCoa(id) {
  const response = await _fetchWithAuth(`${BASE_URL}/print/${id}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    throw new Error(responseJson.message || "Failed to approve Print COA");
  }
  return {
    status: responseJson.status,
    message: responseJson.message,
    data: responseJson.data,
  };
}

export async function rejectPrintCoa(id) {
  const response = await _fetchWithAuth(`${BASE_URL}/print/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    throw new Error(responseJson.message || "Failed to reject Print COA");
  }
  return {
    status: responseJson.status,
    message: responseJson.message,
    data: responseJson.data,
  };
}

export async function getPrintByID(id) {
  const response = await _fetchWithAuth(`${BASE_URL}/print/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    throw new Error(responseJson.message || "Failed to Get Detail Print COA");
  }
  return {
    status: responseJson.status,
    message: responseJson.message,
    data: responseJson.data,
  };
}
