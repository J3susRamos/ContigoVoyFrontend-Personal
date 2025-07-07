import { FormFamilia } from "@/interface";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface FormFieldTextArea {
  label: string;
  register: UseFormRegister<FormFamilia>;
  errors: FieldErrors<FormFamilia>;
  name: keyof FormFamilia;
  rows?: number;
}
const FormFieldTextArea = ({
  label,
  errors,
  register,
  name,
  rows = 2
}: FormFieldTextArea) => {
  return (
    <div className="space-y-2">
      <label className="block text-center text-md font-semibold">{label}</label>
      <div className="px-4 sm:px-8">
        <textarea
        rows={rows}
          {...register(name)}
          className="w-full p-3 text-md font-light text-[#634AE2] bg-[#F3F3F3] dark:bg-[#1e1e23] dark:text-[#bbbafe] rounded-2xl border-none outline-none focus:ring-0 placeholder:text-[#634AE2] resize-none"
        />
        {errors && errors[name] && (
          <span className="text-red-500 text-sm">{errors[name].message}</span>
        )}
      </div>
    </div>
  );
};

export default FormFieldTextArea;
