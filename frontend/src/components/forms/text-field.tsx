import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "@/hooks/form-context.tsx";

export function TextField({
  id,
  label,
  description,
  required,
}: {
  id?: string;
  label: string;
  description?: string;
  required?: boolean;
}) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const inputId = id || label.replace(/\s+/g, "-").toLowerCase();
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={inputId} className="text-muted-foreground text-sm">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>
      <Input
        id={inputId}
        value={field.state.value}
        aria-invalid={isInvalid}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        required={required}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
