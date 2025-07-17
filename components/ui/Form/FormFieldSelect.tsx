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
        className="px-4 text-sm h-9 mt-1 outline-none font-light focus:ring-0 focus:outline-none w-full rounded-full placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-input dark:text-foreground border-2 border-[#634AE2]"
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
