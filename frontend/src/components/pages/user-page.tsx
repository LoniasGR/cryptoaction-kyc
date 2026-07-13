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
import { useAuth } from "@/auth/authProvider";
import { toast } from "sonner";

export function UserPage() {
  const auth = useAuth();
  console.log(auth.userInfo);
  const submit = useMutation({
    mutationFn: submitKYCApplication,
    onSuccess: () => {
      toast.success("KYC application submitted successfully!", { duration: 5000 });
    },
  });
  const form = useAppForm({
    defaultValues: {
      fullName: auth.userInfo?.name || "",
      email: auth.userInfo?.email || "",
      idFile: undefined as File | undefined,
    },
    validators: {
      onSubmit: KYCApplicationSubmitSchema,
    },
    onSubmit: async ({ value }) => {
      if (value.idFile === undefined) {
        return {
          fields: {
            idFile: "ID file is required",
          }
        };
      }
      submit.mutate({ ...value, idFile: value.idFile }, {
        onError: (error) => {
          toast.error("Failed to submit KYC application: " + error.message, { duration: 5000 });
        }
      });
    },
  });

  return (
    <Card className="w-full max-w-md mt-6 mx-auto min-w-xl">
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
                  label="ID File"
                  fileAccept="image/*,.pdf"
                  required
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
