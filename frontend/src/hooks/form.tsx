import { FileUpload } from "@/components/forms/file-upload";
import { SubmitButton } from "@/components/forms/submit-button";
import { TextField } from "@/components/forms/text-field";
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    FileUpload,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
