import { useAuth } from "@/auth/authProvider";
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
import { FieldGroup } from "@/components/ui/field";
import { queryKeys } from "@/config/queryKeys";
import { useAppForm } from "@/forms/form";
import { submitKYCApplication } from "@/services/kyc";
import { KYCApplicationSubmitSchema, type KYCApplicationSubmit } from "@/types/kyc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useConnection } from "wagmi";

export function UserApplication() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const { addresses } = useConnection();
  console.log(addresses);


  const submit = useMutation({
    mutationFn: (data: KYCApplicationSubmit) => submitKYCApplication(data),
    onSuccess: async () => {
      toast.success("KYC application submitted successfully!", { duration: 5000 });
      await queryClient.invalidateQueries({ queryKey: queryKeys.kycApplication(auth.userInfo!.sub) });
    },
    onError: (error) => {
      console.error("Error submitting KYC application:", error);
      toast.error("Failed to submit KYC application: " + error.message, { duration: 10000 });
    }
  });
  const form = useAppForm({
    defaultValues: {
      fullName: auth.userInfo?.name || "",
      email: auth.userInfo?.email || "",
      idFile: undefined as File | undefined,
      blockchainAddress: addresses![0],
    },
    validators: {
      onSubmit({ value }) {
        const result = KYCApplicationSubmitSchema.safeParse(value);
        return result.success ? undefined : result.error;
      },
    },
    onSubmit: async ({ value }) => {
      if (value.idFile === undefined) {
        return {
          fields: {
            idFile: "ID file is required",
          }
        };
      }
      submit.mutate({ ...value, idFile: value.idFile });
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
            >
              {(field) => (
                <field.TextField label="Full Name" required />
              )}
            </form.AppField>
            <form.AppField
              name="email"
            >
              {(field) => <field.TextField label="Email" required />}
            </form.AppField>
            <form.AppField
              name="blockchainAddress"
            >
              {(field) => <field.SelectField label="Wallet Address" items={addresses!} defaultValue={addresses![0]} />}
            </form.AppField>
            <form.AppField
              name="idFile"
            >
              {(field) => (
                <field.FileUpload
                  id="id-upload"
                  label="ID File"
                  fileAccept="image/*,.pdf"
                  required
                />
              )}
            </form.AppField>
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
