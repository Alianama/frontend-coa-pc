import { _fetchWithAuth, BASE_URL } from "./client";

export async function getAllRoles() {
  const response = await _fetchWithAuth(`${BASE_URL}/role`);
  const responseJson = await response.json();

  const { status, message, data } = responseJson;

  if (status !== "success") {
    throw new Error(message || "Get All Role Failed");
  }

  return {
    status,
    message,
    data,
  };
}

export default { getAllRoles };
