import { FormFamilia } from "@/interface";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface FormFieldInputProps {
  label: string;
  register: UseFormRegister<FormFamilia>;
  errors: FieldErrors<FormFamilia>;
  name: keyof FormFamilia;
  type?: string;
  min?: number;
}
const FormFieldInput = ({
  label,
  errors,
  register,
  name,
  type = "text",
}: FormFieldInputProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-center text-md font-semibold">{label}</label>
      <div className="px-4 sm:px-8">
        {type === "text" && (
          <input
            type="text"
            {...register(name)}
            className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none bg-[#F3F3F3] dark:bg-[#1e1e23]"
          />
        )}
        {type === "number" && (
          <input
            type="number"
            min={0}
            {...register("cantidad_hijos", { valueAsNumber: true })}
            className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none bg-[#F3F3F3] dark:bg-[#1e1e23] placeholder:text-[#634AE2]"
          />
        )}

        {errors && errors[name] && (
          <span className="text-red-500 text-sm">{errors[name].message}</span>
        )}
      </div>
    </div>
  );
};

export default FormFieldInput;
