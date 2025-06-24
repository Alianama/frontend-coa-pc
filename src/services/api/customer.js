import { BASE_URL, _fetchWithAuth } from "./client";

export async function getCustomer() {
  const response = await _fetchWithAuth(`${BASE_URL}/customer`);
  const responseJson = await response.json();
  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Get Customer Failed");
  }

  return {
    status,
    message,
    data,
  };
}

export async function addCustomer(customer) {
  const response = await _fetchWithAuth(`${BASE_URL}/customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  const responseJson = await response.json();
  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Gagal menambahkan customer");
  }

  return {
    status,
    message,
    data,
  };
}

export async function UpdateCustomer(customer) {
  const response = await _fetchWithAuth(`${BASE_URL}/customer/${customer.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: customer.name,
      mandatoryFields: customer.mandatoryFields,
    }),
  });

  const responseJson = await response.json();
  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Gagal menambahkan customer");
  }

  return {
    status,
    message,
    data,
  };
}

export async function deleteCustomer(customerId) {
  const response = await _fetchWithAuth(`${BASE_URL}/customer/${customerId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseJson = await response.json();
  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Gagal menghapus customer");
  }

  return {
    status,
    message,
    data,
  };
}
