import { AuthProvider, useAuth } from '@/auth/authProvider';
import { LoadingPage } from '@/components/pages/loading-page';
import { useWeb3, Web3Provider } from '@/web3/web3-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient();

const router = createRouter({
  context: { queryClient, auth: undefined!, web3: undefined! },
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
  const web3 = useWeb3();
  if (!auth.isInitialized) {
    return <LoadingPage />;
  }
  return (<RouterProvider router={router} context={{ queryClient, auth, web3 }} />);
}

const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Web3Provider>
          <AppWithAuth />
        </Web3Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
