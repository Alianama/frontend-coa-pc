import { BASE_URL, _fetchWithAuth } from "./client";

export async function createCOA(coas) {
  try {
    const response = await _fetchWithAuth(`${BASE_URL}/coa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coas),
    });

    const responseJson = await response.json();
    const { status, data, message } = responseJson;

    if (status !== "success") {
      throw new Error(message || "Gagal membuat COA");
    }

    return {
      status,
      data,
      message,
    };
  } catch (error) {
    console.error("Error creating COA:", error);
    throw error;
  }
}

export async function deleteCOA(coaId) {
  try {
    const response = await _fetchWithAuth(`${BASE_URL}/coa/${coaId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== "success") {
      throw new Error(message || "Delete COA failed");
    }

    return {
      status,
      message,
    };
  } catch (error) {
    console.error("Error creating COA:", error);
    throw error;
  }
}

export async function getCOA(page = 0, limit = 0, search = "") {
  const queryParams = new URLSearchParams();

  if (page !== 0) {
    queryParams.append("page", page.toString());
  }

  if (limit !== 0) {
    queryParams.append("limit", limit.toString());
  }

  if (search) {
    queryParams.append("search", search);
  }

  const response = await _fetchWithAuth(
    `${BASE_URL}/coa?${queryParams.toString()}`
  );
  const responseJson = await response.json();
  const { status, data, pagination, message } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Failed to fetch COA data");
  }

  return {
    status,
    data: {
      coas: data || [],
      totalItems: pagination?.total || 0,
      totalPages: pagination?.totalPages || 0,
      currentPage: pagination?.page || 1,
      itemsPerPage: pagination?.limit || limit,
    },
  };
}

export async function updateCoa(coaId, body) {
  const response = await _fetchWithAuth(`${BASE_URL}/coa/${coaId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseJson = await response.json();
  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Gagal memperbarui COA");
  }

  return {
    status,
    message,
    data,
  };
}

export async function approveCOA(coa_id) {
  const response = await _fetchWithAuth(`${BASE_URL}/coa/${coa_id}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseJson = await response.json();

  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Gagal menyetujui COA");
  }

  return {
    status,
    message,
    data,
  };
}

export async function requestApprovalCOA(coa_id) {
  const response = await _fetchWithAuth(
    `${BASE_URL}/coa/${coa_id}/request-approval`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const responseJson = await response.json();

  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Gagal Request Approval COA");
  }

  return {
    status,
    message,
    data,
  };
}

export async function getCoaDetail(coa_id) {
  const response = await _fetchWithAuth(`${BASE_URL}/coa/${coa_id}`);
  const responseJson = await response.json();

  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Get Detail COA Failed");
  }

  return {
    status,
    message,
    data,
  };
}
