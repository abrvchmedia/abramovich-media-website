async function fetchAPI<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  return res.json();
}

// ── Public ──────────────────────────────────────────────

export function getPageBySlug(slug: string) {
  return fetchAPI(`/api/pages/${slug}`);
}

export function getPublicPosts() {
  return fetchAPI("/api/posts");
}

export function getPostBySlug(slug: string) {
  return fetchAPI(`/api/posts/${slug}`);
}

// ── Admin ───────────────────────────────────────────────

export const admin = {
  login: (email: string, password: string) =>
    fetchAPI("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => fetchAPI("/api/admin/logout", { method: "POST" }),

  me: () => fetchAPI("/api/admin/me"),

  // Pages
  getPages: () => fetchAPI("/api/admin/pages"),
  getPage: (id: string) => fetchAPI(`/api/admin/pages/${id}`),
  createPage: (data: Record<string, unknown>) =>
    fetchAPI("/api/admin/pages", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePage: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/api/admin/pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePage: (id: string) =>
    fetchAPI(`/api/admin/pages/${id}`, { method: "DELETE" }),

  addBlock: (pageId: string, block: { type: string; content?: unknown }) =>
    fetchAPI(`/api/admin/pages/${pageId}/add-block`, {
      method: "POST",
      body: JSON.stringify(block),
    }),
  updateBlock: (
    pageId: string,
    blockId: string,
    content: Record<string, unknown>
  ) =>
    fetchAPI(`/api/admin/pages/${pageId}/update-block`, {
      method: "PUT",
      body: JSON.stringify({ blockId, content }),
    }),
  deleteBlock: (pageId: string, blockId: string) =>
    fetchAPI(`/api/admin/pages/${pageId}/blocks/${blockId}`, {
      method: "DELETE",
    }),
  reorderBlocks: (pageId: string, blockIds: string[]) =>
    fetchAPI(`/api/admin/pages/${pageId}/reorder-blocks`, {
      method: "PUT",
      body: JSON.stringify({ blockIds }),
    }),

  // Posts
  getPosts: () => fetchAPI("/api/admin/posts"),
  getPost: (id: string) => fetchAPI(`/api/admin/posts/${id}`),
  createPost: (data: Record<string, unknown>) =>
    fetchAPI("/api/admin/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePost: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/api/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePost: (id: string) =>
    fetchAPI(`/api/admin/posts/${id}`, { method: "DELETE" }),

  // Pipeline (MCP / outreach tracker)
  getPipeline: (params?: Record<string, string>) => {
    const q = new URLSearchParams(params || {});
    const qs = q.toString();
    return fetchAPI(`/api/admin/pipeline${qs ? `?${qs}` : ""}`);
  },
  createPipelineLead: (data: Record<string, unknown>) =>
    fetchAPI("/api/admin/pipeline", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePipelineLead: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/api/admin/pipeline/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deletePipelineLead: (id: string) =>
    fetchAPI(`/api/admin/pipeline/${id}`, { method: "DELETE" }),
  importPipelineRunLog: (body: {
    raw: Record<string, unknown>;
    title?: string;
    batchRunId?: string;
  }) =>
    fetchAPI("/api/admin/pipeline/import-run-log", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  importPipelineRows: (rows: Record<string, unknown>[]) =>
    fetchAPI("/api/admin/pipeline/import-rows", {
      method: "POST",
      body: JSON.stringify({ rows }),
    }),
  getPipelineSnapshots: () => fetchAPI("/api/admin/pipeline/snapshots"),
  createPipelineSnapshot: (data: Record<string, unknown>) =>
    fetchAPI("/api/admin/pipeline/snapshots", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
