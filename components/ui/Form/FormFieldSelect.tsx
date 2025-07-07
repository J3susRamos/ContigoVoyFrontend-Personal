import { FormFamilia } from "@/interface";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface FormFieldSelectProps {
  label: string;
  name: keyof FormFamilia;
  register: UseFormRegister<FormFamilia>;
  errors: FieldErrors<FormFamilia>;
  options: Option[];
  placeholder?: string;
}

const FormFieldSelect = ({
  label,
  name,
  register,
  errors,
  options,
  placeholder,
}: FormFieldSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-center text-md font-semibold">{label}</label>
      <div className="px-4 sm:px-8">
        <select
          {...register(name)}
          className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none font-medium bg-[#F3F3F3] dark:bg-[#1e1e23] text-[#634AE2] dark:text-[#bbbafe]"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors[name]?.message && (
          <span className="text-red-500 text-sm">
            {errors[name].message}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormFieldSelect;
