const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pk_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  isFormData = false
): Promise<{ ok: boolean; status: number; data: T | null; message: string }> {
  const token = getToken();
  const headers: Record<string, string> = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
    });
    const json = await res.json().catch(() => ({ message: "No JSON body" }));
    return { ok: res.ok, status: res.status, data: json.data ?? null, message: json.message ?? "" };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Network error";
    return { ok: false, status: 0, data: null, message: msg };
  }
}

// Auth
export const api = {
  auth: {
    register: (body: object) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body: object) => request<{ token: string; user: object }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    googleLogin: (idToken: string) => request<{ token: string; user: object }>("/auth/google", { method: "POST", body: JSON.stringify({ idToken }) }),
    requestReset: (email: string) => request("/auth/request-reset", { method: "POST", body: JSON.stringify({ email }) }),
    resetPassword: (token: string, newPassword: string) => request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, newPassword }) }),
  },
  profile: {
    getMe: () => request("/profiles/me", { method: "GET" }),
    updateMe: (body: object) => request("/profiles/me", { method: "PUT", body: JSON.stringify(body) }),
    getProfile: (profileId: string) => request(`/profiles/${profileId}`, { method: "GET" }),
    getSkills: () => request("/profiles/skills", { method: "GET" }),
    addSkill: (skillId: string, level: string) => request("/profiles/me/skills", { method: "POST", body: JSON.stringify({ skillId, level }) }),
    removeSkill: (skillId: string) => request(`/profiles/me/skills/${skillId}`, { method: "DELETE" }),
    addProject: (body: object) => request("/profiles/me/projects", { method: "POST", body: JSON.stringify(body) }),
    updateProject: (projectId: string, body: object) => request(`/profiles/me/projects/${projectId}`, { method: "PUT", body: JSON.stringify(body) }),
    deleteProject: (projectId: string) => request(`/profiles/me/projects/${projectId}`, { method: "DELETE" }),
    uploadResume: (formData: FormData) => request("/profiles/me/resume", { method: "POST", body: formData }, true),
    downloadResume: (profileId: string) => `${BASE}/profiles/${profileId}/resume`,
    trackClick: (profileId: string, linkType: string, clickedUrl: string) =>
      request("/profiles/track-click", { method: "POST", body: JSON.stringify({ profileId, linkType, clickedUrl }) }),
  },
  directory: {
    search: (params: Record<string, string>) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/directory${qs ? "?" + qs : ""}`, { method: "GET" });
    },
  },
  admin: {
    getPending: () => request("/admin/pending-users", { method: "GET" }),
    approveUser: (profileId: string) => request(`/admin/approve-user/${profileId}`, { method: "POST" }),
    disableUser: (userId: string) => request(`/admin/disable-user/${userId}`, { method: "POST" }),
    getAnalytics: () => request("/admin/analytics", { method: "GET" }),
    getPitches: () => request("/admin/pitches", { method: "GET" }),
  },
  pitches: {
    create: (body: object) => request("/pitches", { method: "POST", body: JSON.stringify(body) }),
    get: (pitchId: string) => request(`/pitches/${pitchId}`, { method: "GET" }),
    deactivate: (pitchId: string) => request(`/pitches/${pitchId}/deactivate`, { method: "PUT" }),
  },
};
