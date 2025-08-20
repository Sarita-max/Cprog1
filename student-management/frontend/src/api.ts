export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const resp = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!resp.ok) {
    let message = 'Request failed';
    try {
      const data = await resp.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }
  return resp.status === 204 ? (undefined as unknown as T) : (await resp.json());
}
