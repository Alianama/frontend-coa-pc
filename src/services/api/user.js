import { BASE_URL, _fetchWithAuth } from "./client";

export async function getAllUser() {
  const response = await _fetchWithAuth(`${BASE_URL}/users`);
  const responseJson = await response.json();

  const { status, data, message } = responseJson;

  if (status !== "success") {
    throw new Error(message);
  }

  return {
    status,
    data,
  };
}
