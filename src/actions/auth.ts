"use server";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api";

export async function LoginAction({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const response = await apiFetch("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  const cookieStore = await cookies();
  cookieStore.set("token", response.data.access_token);

  return;
}
