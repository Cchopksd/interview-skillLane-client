"use server";
const baseUrl = process.env.API_URL;

export async function apiFetch(path: string, options?: RequestInit) {
  const url = `${baseUrl}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options?.headers || {}),
    },
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message);
  }

  return response;
}
