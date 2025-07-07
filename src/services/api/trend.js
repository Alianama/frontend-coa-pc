import { BASE_URL, _fetchWithAuth } from "./client";

export async function getTrendData({
  productId,
  parameter,
  lotNumber,
  startDate,
  endDate,
}) {
  // Build query parameters
  const params = new URLSearchParams({
    productId: productId,
    parameter: parameter,
  });

  if (lotNumber) params.append("lotNumber", lotNumber);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await _fetchWithAuth(
    `${BASE_URL}/trend/echarts?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const responseJson = await response.json();
  const { success, message, data } = responseJson;

  if (!success) {
    throw new Error(message || "Gagal Get Trend Data");
  }

  return {
    success,
    message,
    data,
  };
}
