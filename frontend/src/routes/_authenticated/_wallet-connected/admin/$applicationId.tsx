import { fetchKYCApplicationById } from '@/api/kyc';
import { ApplicationComponent } from '@/components/pages/admin-page/application/admin-user-application';
import { queryKeys } from '@/config/queryKeys';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_wallet-connected/admin/$applicationId')({
  loader: async ({ context: { queryClient }, params: { applicationId } }) => {
    return queryClient.query({
      queryKey: queryKeys.kycApplication(applicationId),
      queryFn: () => fetchKYCApplicationById(applicationId),
    });
  },
  component: ApplicationComponent,
});
