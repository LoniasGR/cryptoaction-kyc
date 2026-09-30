import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { cryptoaction } from '@/web3/chain';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useBalance, useConnect, useConnection, useConnectors, useDisconnect, useSwitchChain } from 'wagmi';
export const Route = createFileRoute('/_authenticated/wallet')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || undefined,
  }),
  component: SelectWallet,
});

function SelectWallet() {
  const { redirect } = Route.useSearch();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const { address, chain, isConnected } = useConnection();
  const connectors = useConnectors();
  const navigate = useNavigate();
  const switchChain = useSwitchChain();
  const balance = useBalance({ address });

  const onDisconnect = () => {
    disconnect.mutate();
    navigate({ to: '/' });
  };


  const onConnect = async (connector: typeof connectors[number]) => {
    await connect.mutateAsync({ connector });
    await switchChain.mutateAsync({ chainId: cryptoaction.id });
    navigate({ to: redirect || '/' });
  };


  if (isConnected)
    return (
      <main className="flex min-h-[calc(100vh-var(--header-height))] items-center justify-center px-4 py-10">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardDescription className="mb-4">
              <p className="text-lg mb-2">You are already connected to your wallet.</p>
              <p><span className="font-bold">Connected account:</span> {address}</p>
              <p><span className="font-bold">Chain:</span> {chain?.name} with ID {chain?.id}</p>
              <p><span className="font-bold">Balance:</span> {balance.data?.value} {balance.data?.symbol}</p>
            </CardDescription>
            <CardContent>
              <p className="mb-5">You can continue to the application using your connected
                wallet or you can disconnect your wallet.</p>
              <Button className="mr-10">
                <Link to={redirect || '/'} >
                  {redirect ? 'Continue' : 'Home'}
                </Link>
              </Button>
              <Button onClick={onDisconnect}>
                Disconnect
              </Button>
            </CardContent>
          </CardHeader>
        </Card>
      </main>
    );

  return (
    <main className="flex min-h-[calc(100vh-var(--header-height))] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardDescription className="text-lg">
            Connect your wallet to securely access Cryptoaction.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {connectors.map((c) => (
            <Button
              className="w-full sm:w-auto"
              key={c.id}
              disabled={!c || connect.isPending}
              onClick={() => onConnect(c)}
            >
              {connect.isPending ? 'Connecting...' : `Connect with ${c.name}`}
            </Button>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
