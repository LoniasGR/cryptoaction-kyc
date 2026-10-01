import { ApplicationComponent } from '@/components/pages/admin-page/application/admin-user-application';
import { createFileRoute } from '@tanstack/react-router';
import { readContract } from 'wagmi/actions';
import { ABI } from '@/config/contract';
import { config } from '@/config/wagmi';
import { ETHEREUM_DATA } from '@/config/vars';
import { fetchKYCApplicationByBlockchainId } from '#/api/kyc';

export const Route = createFileRoute('/_authenticated/_wallet-connected/admin/$address')({
  loader: async ({ context: { wagmiConnection }, params: { address } }) => {
    const application = await readContract(config, {
      address: ETHEREUM_DATA.contractAddress, // Example Blue-chip Token address
      abi: ABI,
      functionName: 'getKYCApplication',
      args: [address as `0x${string}`],
      account: wagmiConnection?.address,
    });
    const dbApplication = await fetchKYCApplicationByBlockchainId(address); // Assuming you have a function to fetch the application from your database
    return { application, dbApplication };
  },
  component: ApplicationComponent,
});
