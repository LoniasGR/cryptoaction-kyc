import { fetchKYCApplicationById } from '@/api/kyc';
import { ApplicationComponent } from '@/components/pages/admin-page/application/admin-user-application';
import { queryKeys } from '@/config/queryKeys';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/$applicationId')({
  loader: async ({ context: { queryClient }, params: { applicationId } }) => {
    return queryClient.fetchQuery({
      queryKey: queryKeys.kycApplication(parseInt(applicationId, 10)),
      queryFn: () => fetchKYCApplicationById(parseInt(applicationId, 10)),
    });
  },
  component: ApplicationComponent,
});
