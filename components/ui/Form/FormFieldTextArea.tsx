import { FormFamilia } from "@/interface";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormField from "./FormField";

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
    <FormField errors={errors} name={name} label={label}>
        <textarea
        rows={rows}
          {...register(name)}
          className="w-full p-3 text-md text-[#634AE2] bg-[#F3F3F3] dark:bg-[#1e1e23] dark:text-[#bbbafe] rounded-2xl border-none outline-none focus:ring-0 placeholder:text-[#634AE2] font-semibold resize-none"
        />
    </FormField>
  );
};

export default FormFieldTextArea;
