'use client';

const TOKEN_KEY = 'prelegal_token';

async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export const authApi = {
  signup: (email: string, password: string) =>
    apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) }),

  signin: (email: string, password: string) =>
    apiFetch('/api/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) }),

  me: () => apiFetch('/api/auth/me'),
};

export const chatApi = {
  message: (
    messages: { role: string; content: string }[],
    fields: Record<string, unknown>,
    documentType: string = 'mutual-nda',
  ) =>
    apiFetch('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ messages, fields, document_type: documentType }),
    }),
};

export const documentsApi = {
  list: () => apiFetch('/api/documents'),
  getTemplate: (slug: string) => apiFetch(`/api/documents/${slug}/template`),
};
