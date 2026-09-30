import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_wallet-connected')({
  beforeLoad: async ({ context: { wagamiConnection }, location }) => {
    if (!wagamiConnection.isConnected) {
      throw Route.redirect({to: '/wallet', search: { redirect: location.href }});
    }
  },
  component: () => <Outlet />
});

