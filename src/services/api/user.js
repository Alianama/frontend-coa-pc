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
  const response = await _fetchWithAuth(`${BASE_URL}/users/add`, {
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

export async function updateUser({
  id,
  username,
  fullName,
  email,
  password,
  roleId,
}) {
  const response = await _fetchWithAuth(`${BASE_URL}/users/${id}`, {
    method: "PUT",
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

export async function deleteUser(id) {
  try {
    const response = await _fetchWithAuth(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await response.json();

    const { status, data, message } = responseJson;

    if (status !== "success") {
      throw new Error(message);
    }

    return {
      status,
      data,
    };
  } catch (error) {
    throw new Error(`Gagal menghapus user: ${error.message}`);
  }
}

export const resetPassword = async (userId, newPassword) => {
  return _fetchWithAuth(`${BASE_URL}/users/${userId}/reset-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newPassword }),
  });
};

export default {
  getAllUser,
  addUser,
  updateUser,
  deleteUser,
  resetPassword,
};
