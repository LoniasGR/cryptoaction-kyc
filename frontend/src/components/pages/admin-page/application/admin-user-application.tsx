import { generateFileUrl } from '@/api/file';
import { decideKYC, fetchKYCApplicationById } from '@/api/kyc';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { queryKeys } from '@/config/queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from '@tanstack/react-router';


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
            <Button variant="secondary" className="ml-5"><Link to="/admin">Back</Link></Button>
          </CardAction>
          <CardHeader className="text-center">
            <CardTitle>Application Details - {data?.id}</CardTitle>
            <CardDescription>
              <p>Applicant: {data!.fullName} | Submitted at: {new Date(data!.submittedAt).toLocaleDateString()} {new Date(data!.submittedAt).toLocaleTimeString()}</p>
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
          <CardContent className="flex flex-col gap-2">
            <Button variant="default" onClick={() => mutation.mutate('approve')}>Approve</Button>
            <Button variant="destructive" onClick={() => mutation.mutate('reject')}>Reject</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { ApplicationComponent };