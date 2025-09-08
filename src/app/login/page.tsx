"use client";
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";
import { LoginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <AuthCard title="Login">
      <AuthForm
        submitLabel="Sign In"
        fields={[
          {
            name: "username",
            label: "Username",
            type: "text",
            placeholder: "username",
            required: true,
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "••••••••",
            required: true,
          },
        ]}
        onSubmit={async (values) => {
          await LoginAction({
            username: values.username,
            password: values.password,
          });
          router.push("/library");
        }}
        footer={
          <p className="text-sm text-center mt-2">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        }
      />
    </AuthCard>
  );
}
