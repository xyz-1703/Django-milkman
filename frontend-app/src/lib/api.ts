const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const normalizeApiBaseUrl = (input?: string): string => {
  if (!input) {
    return "/api";
  }

  const value = input.replace(/\/$/, "");

  // Keep same-origin path style when configured as /api.
  if (value.startsWith("/")) {
    return value.endsWith("/api") ? value : `${value}/api`;
  }

  // Allow absolute host form and ensure it targets /api.
  if (/^https?:\/\//i.test(value)) {
    return value.endsWith("/api") ? value : `${value}/api`;
  }

  // Fallback to same-origin API path if the env value is malformed.
  return "/api";
};

// Supported forms: /api or https://milkman-frontend.duckdns.org/api
export const API_BASE_URL = normalizeApiBaseUrl(rawApiBaseUrl);

export const getAuthToken = (): string | null => localStorage.getItem("dairyfresh_auth_token");

export const authFetch = async (path: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Token ${token}`);
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

export const authFetchAll = async <T>(path: string): Promise<T[]> => {
  const token = getAuthToken();
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Token ${token}`);
  }

  const allResults: T[] = [];
  let nextUrl: string | null = `${API_BASE_URL}${path}`;

  while (nextUrl) {
    // nextUrl is either the fully-built initial path ("/api/orders/") or an
    // absolute URL returned by DRF pagination ("https://host/api/orders/?page=2").
    // In both cases use it directly — do NOT prepend API_BASE_URL a second time.
    const response = await fetch(nextUrl, {
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to load paginated data");
    }

    const data = (await response.json()) as T[] | PaginatedResponse<T>;
    if (Array.isArray(data)) {
      allResults.push(...data);
      nextUrl = null;
    } else {
      allResults.push(...(data.results || []));
      // DRF returns absolute next URLs using Django's internal host (e.g.
      // http://127.0.0.1:8001/api/...).  Convert them to same-origin paths so
      // the browser fetches through Nginx instead of directly hitting the port.
      if (data.next) {
        try {
          const u = new URL(data.next);
          nextUrl = u.pathname + u.search;
        } catch {
          nextUrl = data.next;
        }
      } else {
        nextUrl = null;
      }
    }
  }

  return allResults;
};
