"use server";
import { apiFetch } from "@/lib/api";

export async function RegisterAction({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const response = await apiFetch("/v1/users", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });



  return;
}
