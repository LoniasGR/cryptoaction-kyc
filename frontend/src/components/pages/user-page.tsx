import { submitKycApplication } from "#/api/kyc";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useAppForm } from '@/hooks/form';
import { useMutation } from '@tanstack/react-query';

export function UserPage() {
  const submit = useMutation({
    mutationFn: submitKycApplication,
    onSuccess: () => {
      alert('KYC application submitted successfully!');
    }
  });
  const form = useAppForm({
    defaultValues: {
      fullName: '',
      email: '',
      idNumber: '',
    },
    onSubmit: async ({ value }) => {
      submit.mutate(value);
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <Card className="w-full max-w-sm mt-6 ml-6">
      <CardAction>
        <Badge variant="secondary" className="ml-4">KYC Application</Badge>
      </CardAction>
      <CardHeader>
        <CardTitle>Submit your credentials</CardTitle>
        <CardDescription>
          Enter your basic information and send your application for verification.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <form.AppField name="fullName"
                children={(field) => <field.TextField label="Full Name" required />}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <form.AppField name="email"
                  children={(field) => <field.TextField label="Email" required />}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <form.AppField name="idNumber"
                  children={(field) => <field.TextField label="ID Number" required />}
                />
              </div>
            </div>
          </div>
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
