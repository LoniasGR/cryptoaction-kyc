import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';
import { AuthProvider, useAuth } from './auth/authProvider';
import { routeTree } from './routeTree.gen';
import { LoadingPage } from './components/pages/loading-page';

const queryClient = new QueryClient();

const router = createRouter({
  context: { queryClient, auth: undefined! },
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
  if (!auth.isInitialized) {
    return <LoadingPage />;
  }
  return (<RouterProvider router={router} context={{ queryClient, auth }} />);
}

const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppWithAuth />
      </AuthProvider>
    </QueryClientProvider>
  );
}
