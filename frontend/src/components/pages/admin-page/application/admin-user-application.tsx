import { generateFileUrl } from '@/api/file';
import { decideKYC } from '@/api/kyc';
import { ApplicationStatusBadge } from '@/components/application-status-badge';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { queryKeys } from '@/config/queryKeys';
import { decideKYCOnChain } from '@/services/kyc';
import { KYCStatus, type KYCStatusType } from '@/types/kyc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLoaderData, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useConnection } from 'wagmi';

// Pending decision describes the button that the admin has clicked but has not yet confirmed.
type PendingDecision = 'approve' | 'reject' | null;

function ApplicationComponent() {
  const { application, dbApplication } = useLoaderData({ from: "/_authenticated/_wallet-connected/admin/$address" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { address: adminAddress } = useConnection();

  const [pendingDecision, setPendingDecision] = useState<PendingDecision>(null);

  const status: KYCStatusType | undefined = application
    ? (KYCStatus[application.status] as KYCStatusType)
    : dbApplication?.status;

  const mutation = useMutation({
    mutationFn: async (decision: 'approve' | 'reject') => {
      if (!application.user) {
        throw new Error('Blockchain address for this application is not known yet');
      }
      await decideKYCOnChain(application.user, decision === 'approve', adminAddress!);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.kycApplication(application.user) }),
      ]);
      navigate({ to: '/admin' });
    },
    onSettled: () => setPendingDecision(null),
  });

  return (
    <div className="bg-muted h-[94vh] flex items-start justify-center">
      <div className="pt-10 justify-center flex sm:flex-col md:flex-row gap-4">
        <Card className="min-w-xs max-w-md lg:min-w-lg sm:min-w-sm">
          <CardAction>
            <ApplicationStatusBadge className="ml-7" status={status} />
          </CardAction>
          <CardHeader className="text-center">
            <CardTitle>Application Details - {dbApplication?.id}</CardTitle>
            <CardDescription>
              <p><span className="font-bold">Applicant:</span> {dbApplication!.fullName} | <span className="font-bold">Submitted at:</span> {new Date(dbApplication!.submittedAt).toLocaleDateString()} {new Date(dbApplication!.submittedAt).toLocaleTimeString()}</p>
              <p className="mt-5"><span className="font-bold">Wallet Address:</span> {dbApplication!.blockchainAddress}</p>
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-5 flex flex-col gap-2">
            <p className="font-heading text-base font-medium pb-2">Documents</p>
            <Button variant="default" className="w-full"
              onClick={() => window.open(generateFileUrl(dbApplication!.idFileHash), '_blank')}>View ID File</Button>
          </CardContent>
        </Card>
        <Card className="min-w-xs max-w-md lg:min-w-3xs sm:min-w-xs">
          <CardHeader className="text-center">
            <CardTitle>Decision Panel</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 min-h-35 lg:min-h-50">
            <Button disabled={status?.toLowerCase() === 'approved'} variant="default" onClick={() => setPendingDecision('approve')}>Approve</Button>
            <Button disabled={status?.toLowerCase() === 'rejected'} variant="destructive" onClick={() => setPendingDecision('reject')}>Reject</Button>
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
            ? `This will approve the KYC application for ${dbApplication?.fullName ?? 'this applicant'}.`
            : `This will reject the KYC application for ${dbApplication?.fullName ?? 'this applicant'}.`
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
