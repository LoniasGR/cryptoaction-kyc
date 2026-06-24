import { useFormContext } from '@/hooks/form-context.tsx';
import { Button } from '../ui/button.tsx';
export function SubmitButton({ label, className }: { label: string, className?: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting} className={className}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
