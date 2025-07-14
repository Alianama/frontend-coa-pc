import {
  BASE_URL,
  _fetchWithAuth,
  putAccessToken,
  putRefreshToken,
} from "./client";

export async function login(username, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const responseJson = await response.json();
  const { status, message, data } = responseJson;

  if (status === "success") {
    putAccessToken(data.accessToken);
    putRefreshToken(data.refreshToken);
    return {
      message,
      data: {
        id: data.id,
        username: data.username,
        email: data.email,
      },
    };
  }

  return {
    status: "error",
    message: "Login Failed",
  };
}

export async function getOwnProfile() {
  const response = await _fetchWithAuth(`${BASE_URL}/users/me`);
  const responseJson = await response.json();
  const { status, data } = responseJson;

  if (status !== "success") {
    throw new Error(response);
  }

  return {
    status: "success",
    data,
  };
}

export async function changePassword({ oldPassword, newPassword }) {
  try {
    const response = await _fetchWithAuth(`${BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const responseJson = await response.json();
    const { status, message, data } = responseJson;

    if (status === "success") {
      return {
        status,
        message: message || "Password berhasil diubah",
        data,
      };
    }

    return {
      status: status || "error",
      message: message || "Gagal mengubah password",
      data,
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message || "Terjadi kesalahan saat mengubah password",
      data: null,
    };
  }
}
