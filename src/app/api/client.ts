const API_BASE =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : "/api";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || res.statusText);
  return data as T;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  status: string;
  lastContacted?: string | null;
  createdAt?: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  author: string;
  timestamp: string;
}

export const api = {
  leads: {
    list: () => request<Lead[]>("/leads"),
    get: (id: string) => request<Lead>(`/leads/${id}`),
    create: (body: Partial<Lead> & { name: string; email: string; notes?: string }) =>
      request<Lead>("/leads", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Lead>) =>
      request<Lead>(`/leads/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) =>
      request<void>(`/leads/${id}`, { method: "DELETE" }),
  },
  notes: {
    list: (leadId: string) => request<LeadNote[]>(`/leads/${leadId}/notes`),
    add: (leadId: string, content: string, author?: string) =>
      request<LeadNote>(`/leads/${leadId}/notes`, {
        method: "POST",
        body: JSON.stringify({ content, author: author || "User" }),
      }),
  },
};
