import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "@/hooks/form-context.tsx";
import { Image } from "lucide-react";

export function FileUpload({
  id,
  label,
  description,
  fileAccept,
  required,
}: {
  id: string;
  label: string;
  description?: string;
  fileAccept?: string;
  required?: boolean;
}) {
  const field = useFieldContext<File>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel
        htmlFor={label.replace(/\s+/g, "-").toLowerCase()}
        className="text-muted-foreground text-sm relative cursor-pointer rounded-md bg-transparent font-semibold focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500"
      >
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>

      <FieldLabel
        htmlFor={id}
        className="relative flex w-full cursor-pointer bg-transparent font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500 mt-2   justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
      >
        {field.state.value && (
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-bold">Selected file:</span> <span className="font-normal">{field.state.value.name}</span>
          </div>
        )}
        <div className="text-center">
          {!field.state.value && <Image className="mx-auto h-12 w-12 text-gray-400" />}
          <div className="mt-4 flex text-sm/6 text-gray-600">
            {!field.state.value && <span>Upload a file</span>}
            <Input
              type="file"
              id={id}
              className="sr-only"
              aria-invalid={isInvalid}
              accept={fileAccept}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  field.handleChange(file);
                  e.currentTarget.value = "";
                }
              }}
              onBlur={field.handleBlur}
              required={required}
            />
            {!field.state.value && <p className="pl-1">or drag and drop</p>}
          </div>
          {!field.state.value &&  <p className="text-xs/5 text-gray-600">Up to 10MB</p>}
        </div>
      </FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
