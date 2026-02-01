import { env } from "@/src/lib/env";

export type ApiErrorPayload = {
  success?: boolean;
  message?: string;
  code?: string;
};

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(status: number, message: string, payload?: ApiErrorPayload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

type FetchOptions = RequestInit & { json?: unknown };

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${env.apiBaseUrl}${path}`;
  const headers = new Headers(opts.headers);

  let body = opts.body;
  if (opts.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(opts.json);
  }

  const res = await fetch(url, {
    ...opts,
    body,
    headers,
    // Better Auth commonly uses cookies for sessions.
    credentials: "include",
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = (isJson ? await res.json().catch(() => null) : null) as any;

  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText || "Request failed";
    throw new ApiError(res.status, msg, data || undefined);
  }

  return (data ?? (await res.text())) as T;
}
