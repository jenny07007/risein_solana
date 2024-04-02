import React, { forwardRef } from "react";
import { FormFieldProps } from "@/types/type";

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      name,
      value,
      onChange,
      max,
      min,
      type = "text",
      placeholder,
      disabled = false,
      required = false,
    },
    ref,
  ) => (
    <div className="mb-4">
      <label className="block text-gray-400 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
          disabled ? "disabled:bg-slate-600" : ""
        } focus:border-purple-400 focus:ring focus:ring-purple-400`}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        max={max}
        min={min}
        placeholder={placeholder}
        required={required}
        ref={ref}
        name={name}
      />
    </div>
  ),
);

FormField.displayName = "FormField";

export default FormField;
