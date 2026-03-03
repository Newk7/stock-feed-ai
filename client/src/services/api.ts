import { auth, isFirebaseConfigured } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL || "";

async function getAuthHeaders(): Promise<Record<string, string>> {
  if (!isFirebaseConfigured) {
    return { Authorization: "Bearer dev-token" };
  }

  const user = auth?.currentUser;
  if (!user) return {};

  try {
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: (data: { displayName?: string; photoUrl?: string }) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => request("/api/auth/me"),
  updatePreferences: (prefs: Record<string, any>) =>
    request("/api/auth/preferences", {
      method: "PATCH",
      body: JSON.stringify(prefs),
    }),

  // News
  getNews: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ articles: any[] }>(`/api/news${qs}`);
  },
  getTrendingNews: (limit = 20) =>
    request<{ articles: any[] }>(`/api/news/trending?limit=${limit}`),
  getNewsBySector: () => request<{ sectors: any[] }>("/api/news/sectors"),
  getNewsCategories: () =>
    request<{ categories: string[] }>("/api/news/categories"),
  getNewsSectors: () =>
    request<{ sectors: string[] }>("/api/news/sectors/list"),
  getArticle: (id: string) => request<{ article: any }>(`/api/news/${id}`),

  // Manifests
  getManifests: (type?: string) =>
    request<{ manifests: any[] }>(
      `/api/manifests${type ? `?type=${type}` : ""}`
    ),
  syncManifests: (prefix: string, bucket?: string) =>
    request("/api/manifests/sync", {
      method: "POST",
      body: JSON.stringify({ prefix, bucket }),
    }),
  listS3Keys: (prefix: string) =>
    request<{ keys: string[] }>(`/api/manifests/keys?prefix=${prefix}`),

  // Watchlists
  getWatchlists: () => request<{ watchlists: any[] }>("/api/watchlists"),
  createWatchlist: (name: string, tickers?: string[]) =>
    request("/api/watchlists", {
      method: "POST",
      body: JSON.stringify({ name, tickers }),
    }),
  updateWatchlist: (id: string, tickers: string[]) =>
    request(`/api/watchlists/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ tickers }),
    }),
  deleteWatchlist: (id: string) =>
    request(`/api/watchlists/${id}`, { method: "DELETE" }),
  getSavedArticles: () =>
    request<{ articles: any[] }>("/api/watchlists/saved"),
  saveArticle: (articleId: string, notes?: string) =>
    request(`/api/watchlists/saved/${articleId}`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    }),
};
