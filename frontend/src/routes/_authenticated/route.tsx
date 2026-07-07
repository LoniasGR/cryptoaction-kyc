import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const { auth } = context;
    console.log("Admin route beforeLoad, auth:", auth);
    if (!auth?.isAuthenticated) {
      auth.login();
      return;
    }
  },
  component: () => <Outlet />,
});