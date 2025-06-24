export const BASE_URL = "http://localhost:3000/api";

export function putAccessToken(token) {
  localStorage.setItem("accessToken", token);
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function putRefreshToken(token) {
  localStorage.setItem("refreshToken", token);
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function clearAccessToken() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export async function _fetchWithAuth(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    if (response.status === 401) {
      // Token expired, coba refresh
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      async function asynRefreshToken(refreshToken) {
        try {
          const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          const responseJson = await response.json();

          if (responseJson.status === "success") {
            console.log(responseJson.data.accessToken);

            const { accessToken } = responseJson.data;
            putAccessToken(accessToken);
            return { accessToken };
          }

          throw new Error(responseJson.message || "Failed to refresh token");
        } catch (error) {
          console.error("Error refreshing token:", error);
          clearAccessToken();
          throw error;
        }
      }

      const newTokens = await asynRefreshToken(refreshToken);
      if (!newTokens) {
        throw new Error("Failed to refresh token");
      }

      // Coba request ulang dengan token baru
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newTokens.accessToken}`,
        },
      });
    }

    return response;
  } catch (error) {
    console.error("Error in _fetchWithAuth:", error);
    throw error;
  }
}
