import React, { ReactNode } from "react";
import { FieldErrors, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> {
  label: string;
  errors?: FieldErrors<T>;
  name?: Path<T>;
  children: ReactNode;
}

const FormField = <T extends FieldValues>({errors, name, label, children}: Props<T>) => {
  return (
    <div className="space-y-2">
      <label className="block text-center text-md font-semibold">{label}</label>
      {children}

        {errors?.[name]?.message && (
          <span className="text-red-500 text-sm font-semibold">
            {String(errors[name]?.message)}
          </span>
        )}
 
    </div>
  );
};

export default FormField;
