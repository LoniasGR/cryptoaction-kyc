import { submitKYCApplication } from "@/api/kyc";
import { KYCApplicationSubmitSchema } from "@/types/kyc";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/hooks/form";
import { useMutation } from "@tanstack/react-query";
import { FieldGroup } from "../ui/field";

export function UserPage() {
  const submit = useMutation({
    mutationFn: submitKYCApplication,
    onSuccess: () => {
      alert("KYC application submitted successfully!");
    },
  });
  const form = useAppForm({
    defaultValues: {
      fullName: "",
      email: "",
      idFile: undefined,
    },
    validators: {
      onSubmit: KYCApplicationSubmitSchema,
    },
    onSubmit: async ({ value }) => {
      submit.mutate(value);
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <Card className="w-full max-w-sm mt-6 mx-auto min-w-xl">
      <CardAction>
        <Badge variant="secondary" className="ml-4">
          KYC Application
        </Badge>
      </CardAction>
      <CardHeader>
        <CardTitle>Submit your credentials</CardTitle>
        <CardDescription>
          Enter your basic information and send your application for
          verification.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardContent>
          <FieldGroup>
            <form.AppField
              name="fullName"
              children={(field) => (
                <field.TextField label="Full Name" required />
              )}
            />
            <form.AppField
              name="email"
              children={(field) => <field.TextField label="Email" required />}
            />
            <form.AppField
              name="idFile"
              children={(field) => (
                <field.FileUpload
                  id="id-upload"
                  label="ID Number"
                  fileAccept="image/*,.pdf"
                />
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col gap-2 mt-4">
          <form.AppForm>
            <form.SubmitButton label="Submit" className="w-full" />
          </form.AppForm>
        </CardFooter>
      </form>
    </Card>
  );
}
