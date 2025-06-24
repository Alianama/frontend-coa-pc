import { BASE_URL, _fetchWithAuth } from "./client";

export async function getProducts() {
  const response = await _fetchWithAuth(`${BASE_URL}/product`);
  const responseJson = await response.json();
  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Get Products Failed");
  }

  return {
    status,
    message,
    data,
  };
}

export async function addProduct(product) {
  const response = await _fetchWithAuth(`${BASE_URL}/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  const responseJson = await response.json();
  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Gagal menambahkan product");
  }

  return {
    status,
    message,
    data,
  };
}

export async function deleteProduct(productId) {
  const response = await _fetchWithAuth(`${BASE_URL}/product/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseJson = await response.json();
  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Gagal menghapus product");
  }

  return {
    status,
    message,
    data,
  };
}

export async function updateProduct(productId, product) {
  const response = await _fetchWithAuth(`${BASE_URL}/product/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productName: product.productName,
      resin: product.resin,
      letDownRatio: product.letDownRatio,
      pelletLength: product.pelletLength,
      pelletHeight: product.pelletHeight,
      color: product.color,
      dispersibility: product.dispersibility,
      mfr: product.mfr,
      density: product.density,
      moisture: product.moisture,
      carbonContent: product.carbonContent,
      foreignMatter: product.foreignMatter,
      weightOfChips: product.weightOfChips,
      intrinsicViscosity: product.intrinsicViscosity,
      ashContent: product.ashContent,
      heatStability: product.heatStability,
      lightFastness: product.lightFastness,
      granule: product.granule,
      deltaE: product.deltaE,
      macaroni: product.macaroni,
    }),
  });

  const responseJson = await response.json();
  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Failed update product");
  }

  return {
    status,
    message,
    data,
  };
}
