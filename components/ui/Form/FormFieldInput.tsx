import { FieldErrors, UseFormRegister, FieldValues, Path } from "react-hook-form";

interface FormFieldInputProps<T extends FieldValues> {
  label: string;
  register?: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  name?: Path<T>;
  type?: string;
  min?: number;
  disabled?: boolean;
  readOnly?:boolean;
  value?: string;
}
const FormFieldInput = <T extends FieldValues>({
  label,
  errors,
  register,
  name,
  type = "text",
  disabled = false,
  value,
  readOnly
}: FormFieldInputProps<T>) => {
  return (
    <div className="space-y-2">
      <label className="block text-center text-md font-semibold">{label}</label>
      <div className="px-4 sm:px-8">
        {type === "text" && (
          <input
            type="text"
            value={value}
            {...(register && name && register(name))}
            disabled = {disabled}
            readOnly = {readOnly}
            className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none bg-[#F3F3F3] dark:bg-[#1e1e23]"
          />
        )}
        {type === "number" && (
          <input
            type="number"
            min={0}
            disabled = {disabled}
            {...(register && name && register(name, { valueAsNumber: true }))}
            className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none bg-[#F3F3F3] dark:bg-[#1e1e23] placeholder:text-[#634AE2]"
          />
        )}

        {errors?.[name]?.message && (
          <span className="text-red-500 text-sm">{String(errors[name]?.message)}</span>
        )}
      </div>
    </div>
  );
};

export default FormFieldInput;
