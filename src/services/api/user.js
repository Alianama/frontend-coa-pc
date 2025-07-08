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

export async function addUser({ username, fullName, email, password, roleId }) {
  const response = await _fetchWithAuth(`${BASE_URL}/auth/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      fullName,
      email,
      password,
      roleId,
    }),
  });

  const responseJson = await response.json();
  const { status, data, message } = responseJson;

  if (status !== "success") {
    throw new Error(message);
  }

  return {
    status,
    message,
    data,
  };
}
