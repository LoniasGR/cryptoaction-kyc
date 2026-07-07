import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "@/hooks/form-context.tsx";
import { FileTextIcon, XIcon } from "lucide-react";

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
  const field = useFieldContext<File | undefined>();
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
      <Attachment>
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          {field.state.value && (
            <AttachmentTitle>{field.state.value.name}</AttachmentTitle>
          )}
          {!field.state.value && (
            <FieldLabel
              htmlFor={id}
            >
              <AttachmentTitle>Upload a file or drag and drop</AttachmentTitle>
              <AttachmentDescription>Up to 10MB</AttachmentDescription>
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
              />
            </FieldLabel>
          )}
        </AttachmentContent>
        {field.state.value && (
          <AttachmentActions>
            <AttachmentAction aria-label="Remove uploaded file" onClick={() => field.handleChange(undefined)}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        )}
      </Attachment>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
