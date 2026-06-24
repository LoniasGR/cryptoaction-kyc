import {
  Field,
  FieldError,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext } from '@/hooks/form-context.tsx';

export function TextField({ label, required }: { label: string; required?: boolean }) {
  const field = useFieldContext<string>();

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        required={required}
      />
      <FieldError errors={field.state.meta.errors} />
    </Field>
  );
}