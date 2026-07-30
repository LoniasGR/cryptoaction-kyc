import { Badge } from '#/components/ui/badge';
import { generateFileUrl } from '@/api/file';
import { decideKYC, fetchKYCApplicationById } from '@/api/kyc';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { queryKeys } from '@/config/queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { buttonVariants } from "@/components/ui/button";


function ApplicationComponent() {
  const applicationId = useParams({ from: "/_authenticated/admin/$applicationId" }).applicationId;
  const navigator = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.kycApplication(applicationId),
    queryFn: () => fetchKYCApplicationById(applicationId),
  });
  const mutation = useMutation({
    mutationFn: (decision: 'approve' | 'reject') => decideKYC(applicationId, decision),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.kycApplication(applicationId) });
      navigator({ to: '/admin' });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-muted h-[94vh] flex items-start justify-center">
      <div className="pt-10 justify-center flex sm:flex-col md:flex-row gap-4">
        <Card className="min-w-xs max-w-md lg:min-w-lg sm:min-w-sm">
          <CardAction>
             <Badge className="ml-7">{data?.status}</Badge>
          </CardAction>
          <CardHeader className="text-center">
            <CardTitle>Application Details - {data?.id}</CardTitle>
            <CardDescription>
              <p><span className="font-bold">Applicant:</span> {data!.fullName} | <span className="font-bold">Submitted at:</span> {new Date(data!.submittedAt).toLocaleDateString()} {new Date(data!.submittedAt).toLocaleTimeString()}</p>
              <p className="mt-5"><span className="font-bold">Wallet Address:</span> {data!.blockchainAddress}</p>
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-5 flex flex-col gap-2">
            <p className="font-heading text-base font-medium pb-2">Documents</p>
            <Button variant="default" className="w-full"
              onClick={() => window.open(generateFileUrl(data!.idFileHash), '_blank')}>View ID File</Button>
          </CardContent>
        </Card>
        <Card className="min-w-xs max-w-md lg:min-w-3xs sm:min-w-xs">
          <CardHeader className="text-center">
            <CardTitle>Decision Panel</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 min-h-35 lg:min-h-50">
            <Button variant="default" onClick={() => mutation.mutate('approve')}>Approve</Button>
            <Button variant="destructive" onClick={() => mutation.mutate('reject')}>Reject</Button>
            <Link to="/admin" className={buttonVariants({ variant: "secondary", className: "mt-auto" })}>Back</Link>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { ApplicationComponent };