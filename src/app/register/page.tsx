"use client";
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";
import { RegisterAction } from "@/actions/register";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  return (
    <AuthCard title="Register">
      <AuthForm
        submitLabel="Create Account"
        fields={[
          {
            name: "username",
            label: "Username",
            type: "text",
            placeholder: "username",
            autoComplete: "username",
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "••••••••",
            autoComplete: "new-password",
          },
        ]}
        onSubmit={async (values) => {
          await RegisterAction({
            username: values.username,
            password: values.password,
          });
          router.push("/login");
        }}
        footer={
          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        }
      />
    </AuthCard>
  );
}
