"use client";
import { useState } from "react";
import FormInput from "./FormInput";

export type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
};

type Props = {
  fields: Field[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  footer?: React.ReactNode;
};

export default function AuthForm({
  fields,
  submitLabel,
  onSubmit,
  footer,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Real-time validation for password confirmation
    if (name === "password" && values.confirmPassword) {
      if (value !== values.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = values[field.name] || "";

      if (field.required && value.trim() === "") {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err: any) {
      setFormError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formError && <p className="text-red-600">{formError}</p>}

      {fields.map((f) => (
        <FormInput
          key={f.name}
          label={f.label}
          name={f.name}
          type={f.type || "text"}
          placeholder={f.placeholder}
          autoComplete={f.autoComplete}
          value={values[f.name] ?? ""}
          onChange={(e) => handleChange(f.name, e.currentTarget.value)}
          error={errors[f.name]}
          required={f.required}
          aria-required={f.required}
        />
      ))}

      <button
        type="submit"
        aria-required={fields.some((f) => f.required)}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 cursor-pointer"
      >
        {loading ? "Processing..." : submitLabel}
      </button>

      {footer}
    </form>
  );
}
