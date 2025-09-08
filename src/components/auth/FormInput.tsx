"use client";
import { InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props = {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({
  label,
  name,
  error,
  className,
  required,
  ...rest
}: Props) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {required && <span className="text-red-500">*</span>}
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={clsx(
          "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none",
          error ? "border-red-500" : "border-gray-300",
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
