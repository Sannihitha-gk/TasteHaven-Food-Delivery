/**
 * TasteHaven — API Service
 * Connects React (localhost:3000) → Django (localhost:8000)
 */

const BASE = "http://localhost:8000/api";

// ── helpers ─────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("access_token");

const headers = (extra = {}) => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const handle = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || `HTTP ${res.status}`);
  }
  // 204 No Content has no body
  if (res.status === 204) return null;
  return res.json();
};

// ── Auth (JWT) ───────────────────────────────────────────────────
export const authAPI = {
  /**
   * POST /api/token/
   * Returns { access, refresh }
   * Store access in localStorage as "access_token"
   */
  login: (username, password) =>
    fetch(`${BASE}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(handle),

  /** Refresh expired token */
  refresh: (refresh) =>
    fetch(`${BASE}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    }).then(handle),
};

// ── Restaurants ──────────────────────────────────────────────────
export const restaurantAPI = {
  /**
   * GET /api/restaurants/
   * Returns: [{ id, name, location, menu_items: [...] }]
   */
  list: () =>
    fetch(`${BASE}/restaurants/`).then(handle),

  /**
   * GET /api/restaurants/{id}/
   * Returns one restaurant with nested menu_items
   */
  detail: (id) =>
    fetch(`${BASE}/restaurants/${id}/`).then(handle),

  /**
   * GET /api/restaurants/menu/?restaurant=4
   * Returns: [{ id, name, price, restaurant }]
   */
  getMenu: (restaurantId) =>
    fetch(`${BASE}/restaurants/menu-items/?restaurant=${restaurantId}`).then(handle),
};

// ── Cart & Orders ────────────────────────────────────────────────

export const orderAPI = {
  // Get all orders
  allOrders: () =>
    fetch(`${BASE}/orders/`, {
      headers: headers(),
    }).then(handle),

  // Create order
  place: (orderData) =>
    fetch(`${BASE}/orders/`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(orderData),
    }).then(handle),
};

