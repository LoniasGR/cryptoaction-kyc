import { ApplicationStatusBadge } from '@/components/application-status-badge';
import { generateFileUrl } from '@/api/file';
import { decideKYC, fetchKYCApplicationById } from '@/api/kyc';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { queryKeys } from '@/config/queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { buttonVariants } from "@/components/ui/button";
import { useState } from 'react';
// Pending decision describes the button that the admin has clicked but has not yet confirmed.
type PendingDecision = 'approve' | 'reject' | null;

function ApplicationComponent() {
  const applicationId = useParams({ from: "/_authenticated/admin/$applicationId" }).applicationId;
  const navigator = useNavigate();
  const queryClient = useQueryClient();
  const [pendingDecision, setPendingDecision] = useState<PendingDecision>(null);

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
    onSettled: () => setPendingDecision(null),
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
            <ApplicationStatusBadge className="ml-7" status={data?.status} />
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
            <Button disabled={data?.status.toLowerCase() === 'approved'} variant="default" onClick={() => setPendingDecision('approve')}>Approve</Button>
            <Button disabled={data?.status.toLowerCase() === 'rejected'} variant="destructive" onClick={() => setPendingDecision('reject')}>Reject</Button>
            <Link to="/admin" className={buttonVariants({ variant: "secondary", className: "mt-auto" })}>Back</Link>

          </CardContent>
        </Card>
      </div>
      <ConfirmDialog
        open={pendingDecision !== null}
        onOpenChange={(open) => !open && setPendingDecision(null)}
        title={pendingDecision === 'approve' ? 'Approve application?' : 'Reject application?'}
        description={
          pendingDecision === 'approve'
            ? `This will approve the KYC application for ${data?.fullName ?? 'this applicant'}.`
            : `This will reject the KYC application for ${data?.fullName ?? 'this applicant'}.`
        }
        confirmLabel={pendingDecision === 'approve' ? 'Approve' : 'Reject'}
        confirmVariant={pendingDecision === 'approve' ? 'default' : 'destructive'}
        isLoading={mutation.isPending}
        onConfirm={() => pendingDecision && mutation.mutate(pendingDecision)}
      />
    </div>
  );
}

export { ApplicationComponent };