const api = (() => {
  const BASE_URL = "http://localhost:3000/api";

  function putAccessToken(token) {
    localStorage.setItem("accessToken", token);
  }

  function getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  function putRefreshToken(token) {
    localStorage.setItem("refreshToken", token);
  }

  function getRefreshToken() {
    return localStorage.getItem("refreshToken");
  }

  function clearAccessToken() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  async function _fetchWithAuth(url, options = {}) {
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

  async function login(username, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const responseJson = await response.json();
    const { message, data } = responseJson;

    if (message === "success") {
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
  async function getOwnProfile() {
    const response = await _fetchWithAuth(`${BASE_URL}/auth/profile`);
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

  async function createCOA(coas) {
    try {
      const response = await _fetchWithAuth(`${BASE_URL}/coa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coas),
      });

      const responseJson = await response.json();
      const { status, data, message } = responseJson;

      if (status !== "success") {
        throw new Error(message || "Gagal membuat COA");
      }

      return {
        status,
        data,
        message,
      };
    } catch (error) {
      console.error("Error creating COA:", error);
      throw error;
    }
  }

  async function deleteCOA(coaId) {
    try {
      const response = await _fetchWithAuth(`${BASE_URL}/coa/${coaId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseJson = await response.json();
      const { status, message } = responseJson;

      if (status !== "success") {
        throw new Error(message || "Delete COA failed");
      }

      return {
        status,
        message,
      };
    } catch (error) {
      console.error("Error creating COA:", error);
      throw error;
    }
  }

  async function getCOA(page = 0, limit = 0, search = "") {
    const queryParams = new URLSearchParams();

    if (page !== 0) {
      queryParams.append("page", page.toString());
    }

    if (limit !== 0) {
      queryParams.append("limit", limit.toString());
    }

    if (search) {
      queryParams.append("search", search);
    }

    const response = await _fetchWithAuth(
      `${BASE_URL}/coa?${queryParams.toString()}`
    );
    const responseJson = await response.json();
    const { status, data, pagination, message } = responseJson;

    if (status !== "success") {
      throw new Error(message || "Failed to fetch COA data");
    }

    return {
      status,
      data: {
        coas: data || [],
        totalItems: pagination?.total || 0,
        totalPages: pagination?.totalPages || 0,
        currentPage: pagination?.page || 1,
        itemsPerPage: pagination?.limit || limit,
      },
    };
  }

  async function updateCoa(coaId, body) {
    const response = await _fetchWithAuth(`${BASE_URL}/coa/${coaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseJson = await response.json();
    const { status, message, data } = responseJson;

    if (status !== "success") {
      throw new Error(message || "Gagal memperbarui COA");
    }

    return {
      status,
      message,
      data,
    };
  }

  async function getAllUser() {
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

  async function approveCOA(coa_id) {
    const response = await _fetchWithAuth(`${BASE_URL}/coa/${coa_id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await response.json();

    const { status, message, data } = responseJson;

    if (status !== "success") {
      throw new Error(message || "Gagal menyetujui COA");
    }

    return {
      status,
      message,
      data,
    };
  }

  async function requestApprovalCOA(coa_id) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/coa/${coa_id}/request-approval`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseJson = await response.json();

    const { status, message, data } = responseJson;

    if (status !== "success") {
      throw new Error(message || "Gagal Request Approval COA");
    }

    return {
      status,
      message,
      data,
    };
  }

  async function getCoaDetail(coa_id) {
    const response = await _fetchWithAuth(`${BASE_URL}/coa/${coa_id}`);
    const responseJson = await response.json();

    const { status, message, data } = responseJson;

    if (status !== "success") {
      throw new Error(message || "Get Detail COA Failed");
    }

    return {
      status,
      message,
      data,
    };
  }

  async function getCustomer() {
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

  async function addCustomer(customer) {
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
  async function UpdateCustomer(customer) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/customer/${customer.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: customer.name,
          mandatoryFields: customer.mandatoryFields,
        }),
      }
    );

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

  async function deleteCustomer(customerId) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/customer/${customerId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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

  async function getProducts() {
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

  async function addProduct(product) {
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
  async function deleteProduct(productId) {
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

  async function updateProduct(productId, product) {
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

  async function getAllPrint(page = 1, limit = 100, search = "") {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (search) {
      queryParams.append("search", search);
    }

    const response = await _fetchWithAuth(
      `${BASE_URL}/print?${queryParams.toString()}`
    );
    const responseJson = await response.json();
    const { status, message, data, pagination } = responseJson;

    if (status !== "success") {
      throw new Error(message || "Get Print list failed");
    }

    return {
      status,
      message,
      data,
      pagination,
    };
  }

  async function getPlanning(page = 1, limit = 100, search = "") {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (search) {
      queryParams.append("search", search);
    }
    const url = `${BASE_URL}/planning?${queryParams.toString()}`;
    const response = await _fetchWithAuth(url);
    const responseJson = await response.json();
    if (responseJson.status !== "success")
      throw new Error(responseJson.message || "Gagal ambil planning");
    return {
      status: "success",
      data: responseJson.data,
      pagination: responseJson.pagination,
      message: responseJson.message,
    };
  }

  async function createPlanning(planning) {
    const response = await _fetchWithAuth(`${BASE_URL}/planning`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(planning),
    });
    const responseJson = await response.json();
    if (responseJson.status !== "success")
      throw new Error(responseJson.message || "Gagal membuat planning");
    return {
      status: "success",
      data: responseJson.data,
      message: responseJson.message,
    };
  }

  async function deletePlanning(planningId) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/planning/${planningId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    const responseJson = await response.json();
    if (responseJson.status !== "success")
      throw new Error(responseJson.message || "Gagal hapus planning");
    return { status: "success", message: responseJson.message };
  }

  async function updatePlanning(planningId, planning) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/planning/${planningId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planning),
      }
    );
    const responseJson = await response.json();
    if (responseJson.status !== "success")
      throw new Error(responseJson.message || "Gagal update planning");
    return {
      status: "success",
      data: responseJson.data,
      message: responseJson.message,
    };
  }

  async function getDetailPlanningByLot(lotNumber) {
    const url = `${BASE_URL}/planning/detail/by-lot/${lotNumber}`;
    const response = await _fetchWithAuth(url);
    const responseJson = await response.json();
    if (responseJson.status !== "success")
      throw new Error(responseJson.message || "Failed get detail planning");
    return {
      status: "success",
      data: responseJson.data,
      totalQtyCheck: responseJson.totalQtyCheck,
      header: responseJson.header,
    };
  }

  async function postPlanningDetail(data) {
    const response = await _fetchWithAuth(`${BASE_URL}/planning/detail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const responseJson = await response.json();
    if (responseJson.status !== "success") {
      throw new Error(responseJson.message || "Gagal post detail planning");
    }
    return {
      status: responseJson.status,
      message: responseJson.message,
      data: responseJson.data,
    };
  }

  return {
    putAccessToken,
    getAccessToken,
    putRefreshToken,
    getRefreshToken,
    clearAccessToken,
    login,
    getOwnProfile,
    getAllUser,
    approveCOA,
    requestApprovalCOA,
    getCoaDetail,
    getCOA,
    createCOA,
    deleteCOA,
    updateCoa,
    getCustomer,
    addCustomer,
    UpdateCustomer,
    deleteCustomer,
    getProducts,
    addProduct,
    deleteProduct,
    updateProduct,
    getAllPrint,
    getPlanning,
    createPlanning,
    deletePlanning,
    updatePlanning,
    getDetailPlanningByLot,
    postPlanningDetail,
  };
})();

export default api;
