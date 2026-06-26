import { decideKYC, fetchKYCApplicationById } from '@/api/kyc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { queryKeys } from '@/config/queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/$applicationId')({
  loader: async ({ context: { queryClient }, params: { applicationId } }) => {
    return queryClient.fetchQuery({
      queryKey: queryKeys.kycApplication(parseInt(applicationId, 10)),
      queryFn: () => fetchKYCApplicationById(parseInt(applicationId, 10)),
    });
  },
  component: ApplicationComponent,
});

function ApplicationComponent() {
  const applicationId = Route.useParams().applicationId;
  const navigator = Route.useNavigate();
  const queryClient = useQueryClient();
  
  const { data } = useQuery({
    queryKey: queryKeys.kycApplication(parseInt(applicationId, 10)),
    queryFn: () => fetchKYCApplicationById(parseInt(applicationId, 10)),
  });
  const mutation = useMutation({
    mutationFn: (decision: 'approve' | 'reject') => decideKYC(parseInt(applicationId, 10), decision),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.kycApplication(parseInt(applicationId, 10)) });
      navigator({ to: '/admin' });
    },
  });

  return (
    <div className="bg-muted h-full">
      <div className="pt-10 flex justify-center ">
        <Card className="min-w-xs lg:min-w-lg sm:min-w-sm">
          <CardHeader>
            <CardTitle>Application Details - {data?.id}</CardTitle>
            <CardDescription>
              <p>Applicant: {data?.fullName} | Submitted: {new Date(data?.submittedAt).toLocaleDateString()} {new Date(data?.submittedAt).toLocaleTimeString()}</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            TODO
          </CardContent>
        </Card>
        <Card className="min-w-xs lg:min-w-3xs sm:min-w-xs">
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