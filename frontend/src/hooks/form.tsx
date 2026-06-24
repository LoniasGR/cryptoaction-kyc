import { SubmitButton } from '@/components/forms/submit-button.tsx';
import { TextField } from '@/components/forms/text-field.tsx';
import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './form-context.tsx';

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});