(function (global) {
  const API_BASE = "http://free-base-laravel.test/api";

  function getAuthPayload(result) {
    const data = result && result.data !== undefined ? result.data : result;
    if (data && data.client && data.token) return data;
    return null;
  }

  function getErrorMessage(result, fallback) {
    if (result && typeof result.message === "string" && result.message) {
      return result.message;
    }
    if (result && result.errors) {
      const key = Object.keys(result.errors)[0];
      const first = result.errors[key];
      if (Array.isArray(first) && first[0]) return first[0];
    }
    return fallback;
  }

  function saveAuth(payload) {
    if (!payload || !payload.token || !payload.client) return;
    localStorage.setItem("auth_token", payload.token);
    localStorage.setItem("auth_client", JSON.stringify(payload.client));
    localStorage.removeItem("allusers");
  }

  function getToken() {
    return localStorage.getItem("auth_token");
  }

  function getClient() {
    const raw = localStorage.getItem("auth_client");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  function clearAuth() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_client");
  }

  function isLoggedIn() {
    return !!getToken();
  }

  async function parseResponse(response) {
    let result = {};
    try {
      result = await response.json();
    } catch (_) {
      result = {};
    }
    return { response, result };
  }

  function authHeaders() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const token = getToken();
    if (token) headers.Authorization = "Bearer " + token;
    return headers;
  }

  async function apiPost(path, body) {
    const response = await fetch(API_BASE + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    return parseResponse(response);
  }

  async function apiPostAuth(path, body) {
    const response = await fetch(API_BASE + path, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body ?? {}),
    });
    return parseResponse(response);
  }

  async function apiGetAuth(path) {
    const response = await fetch(API_BASE + path, {
      method: "GET",
      headers: authHeaders(),
    });
    return parseResponse(response);
  }

  async function apiPostFormAuth(path, formData) {
    const headers = { Accept: "application/json" };
    const token = getToken();
    if (token) headers.Authorization = "Bearer " + token;

    const response = await fetch(API_BASE + path, {
      method: "POST",
      headers,
      body: formData,
    });
    return parseResponse(response);
  }

  function getData(result) {
    if (result && result.data !== undefined) return result.data;
    return result;
  }

  function requireAuth(loginUrl) {
    if (isLoggedIn()) return true;
    const base = loginUrl || "../login/index.html";
    const separator = base.includes("?") ? "&" : "?";
    global.location.href =
      base + separator + "next=" + encodeURIComponent(global.location.href);
    return false;
  }

  async function logout() {
    try {
      if (getToken()) {
        await apiPostAuth("/logout", {});
      }
    } finally {
      clearAuth();
      if (typeof global.initAuthNav === "function") {
        global.initAuthNav();
      }
    }
  }

  global.AuthApi = {
    API_BASE,
    apiPost,
    apiPostAuth,
    apiGetAuth,
    apiPostFormAuth,
    getAuthPayload,
    getErrorMessage,
    getData,
    saveAuth,
    getToken,
    getClient,
    clearAuth,
    isLoggedIn,
    requireAuth,
    logout,
  };
})(window);
