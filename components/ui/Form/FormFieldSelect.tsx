import React from "react";
import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import FormField from "./FormField";

interface Option {
  label: string;
  value: string;
}

interface FormFieldSelectProps<T extends FieldValues>{
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  options: Option[];
  placeholder?: string;
}

const FormFieldSelect = <T extends FieldValues>({
  label,
  name,
  register,
  errors,
  options,
  placeholder,
}: FormFieldSelectProps<T>) => {
  return (
    <FormField errors={errors} name={name} label={label}>
      <select
        {...register(name)}
        className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none font-medium bg-[#F3F3F3] dark:bg-[#1e1e23] text-[#5d23df] dark:text-[#bbbafe]"
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
    </FormField>
  );
};

export default FormFieldSelect;
