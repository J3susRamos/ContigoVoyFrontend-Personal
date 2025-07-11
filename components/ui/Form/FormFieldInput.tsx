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
            className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none bg-[#F3F3F3] dark:bg-[#1e1e23] dark:text-[#babbfe]"
          />
        )}
        {type === "number" && (
          <input
            type="number"
            min={0}
            disabled = {disabled}
            {...(register && name && register(name, { valueAsNumber: true }))}
            className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none bg-[#F3F3F3] dark:bg-[#1e1e23] placeholder:text-[#babbfe] dark:text-[#babbfe]"
          />
        )}
    </FormField>
  );
};

export default FormFieldInput;
