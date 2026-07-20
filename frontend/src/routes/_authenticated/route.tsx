import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const { auth } = context;
    if (!auth?.isAuthenticated) {
      auth.login();
      return;
    }
  },
  component: () => <Outlet />,
});