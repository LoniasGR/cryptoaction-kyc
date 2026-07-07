import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';
import { AuthProvider, useAuth } from './auth/authProvider';
import { Spinner } from './components/ui/spinner';
import { routeTree } from './routeTree.gen';

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
    return <div className='flex justify-center items-center h-screen'><Spinner className="size-10" /></div>;
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
