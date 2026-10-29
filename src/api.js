// All communication with the FastAPI backend lives in this one file.
const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
const TOKEN_KEY = "access_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Called when the server says our token is invalid or expired (HTTP 401)
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => (onUnauthorized = fn);

// FastAPI errors look like {detail: "text"} or {detail: [{msg: "..."}]} for validation
function errorMessage(data, status) {
  if (!data || !data.detail) return `Request failed (${status})`;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) return data.detail.map((d) => d.msg).join(", ");
  return `Request failed (${status})`;
}

async function request(path, { method = "GET", body, form, auth = true } = {}) {
  const headers = {};
  let payload;

  if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    payload = new URLSearchParams(form);
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { method, headers, body: payload });
  } catch {
    throw new Error("Cannot reach the server. It may be waking up - try again in a moment.");
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && auth) onUnauthorized();
    throw new Error(errorMessage(data, res.status));
  }
  return data;
}

export const register = (email, password) =>
  request("/auth/register", { method: "POST", body: { email, password }, auth: false });

// Your backend's login uses OAuth2 form fields, so it needs "username" (we send the email) + "password"
export const login = (email, password) =>
  request("/auth/login", { method: "POST", form: { username: email, password }, auth: false });

export const listTasks = () => request("/tasks");
export const createTask = (title, description) =>
  request("/tasks", { method: "POST", body: { title, description: description || null } });
export const updateTask = (id, changes) =>
  request(`/tasks/${id}`, { method: "PATCH", body: changes });
export const deleteTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });
