import { BASE_URL, _fetchWithAuth } from "./client";

export async function getProductStandards(productId) {
  const response = await _fetchWithAuth(
    `${BASE_URL}/product-standard/product/${productId}`
  );
  if (!response.ok) throw new Error("Gagal mengambil data standar produk");
  const data = await response.json();
  return data;
}

export async function createProductStandard(data) {
  const response = await _fetchWithAuth(`${BASE_URL}/product-standard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (result.status !== "success") throw new Error(result.message);
  return result;
}

export async function updateProductStandard(id, data) {
  const response = await _fetchWithAuth(`${BASE_URL}/product-standard/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (result.status !== "success") throw new Error(result.message);
  return result;
}

export async function deleteProductStandard(id) {
  const response = await _fetchWithAuth(`${BASE_URL}/product-standard/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const result = await response.json();
  if (result.status !== "success") throw new Error(result.message);
  return result;
}
