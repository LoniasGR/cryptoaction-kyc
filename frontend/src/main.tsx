import { AuthProvider, useAuth } from '@/auth/authProvider';
import { LoadingPage } from '@/components/pages/loading-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';
import { useConnection, WagmiProvider } from 'wagmi';
import { config } from './config/wagmi';
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient();

const router = createRouter({
  context: { queryClient, auth: undefined!, wagamiConnection: undefined! },
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function AppWithAuth() {
  const auth = useAuth();
  const connection = useConnection();
  if (!auth.isInitialized) {
    return <LoadingPage />;
  }
  return (<RouterProvider router={router} context={{ queryClient, auth, wagamiConnection: connection }} />);
}

const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppWithAuth />
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
