const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// Default to same-origin API path so production works behind Nginx without extra env setup.
export const API_BASE_URL = (rawApiBaseUrl || "/api").replace(/\/$/, "");

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
    const response = await fetch(isAbsoluteUrl(nextUrl) ? nextUrl : `${API_BASE_URL}${nextUrl}`, {
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
      nextUrl = data.next;
    }
  }

  return allResults;
};
