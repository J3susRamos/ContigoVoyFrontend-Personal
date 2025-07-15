import { FieldErrors, UseFormRegister, FieldValues, Path } from "react-hook-form";
import FormField from "./FormField";

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
  minLenght?: number;
  maxLenght?: number;
}
const FormFieldInput = <T extends FieldValues>({
  label,
  errors,
  register,
  name,
  type = "text",
  disabled = false,
  maxLenght,
  value,
  readOnly,
  minLenght
}: FormFieldInputProps<T>) => {
  return (
    <FormField errors={errors} name={name} label={label}>
        {type === "text" && (
          <input
            type="text"
            value={value}
            {...(register && name && register(name))}
            disabled = {disabled}
            readOnly = {readOnly}
            maxLength= {maxLenght}
            minLength= {minLenght}
            className="px-4 text-sm h-9 mt-1 outline-none font-light focus:ring-0 focus:outline-none w-full rounded-full placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-input dark:text-foreground border-2 border-[#634AE2]"
            />
        )}
        {type === "number" && (
          <input
            type="number"
            min={0}
            disabled = {disabled}
            {...(register && name && register(name, { valueAsNumber: true }))}
            className="px-4 text-sm h-9 mt-1 outline-none font-light focus:ring-0 focus:outline-none w-full rounded-full placeholder:text-[#634AE2] bg-[#F3F3F3] dark:bg-input dark:text-foreground border-2 border-[#634AE2]"
            />
        )}
    </FormField>
  );
};

export default FormFieldInput;
