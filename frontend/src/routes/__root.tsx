import { type AuthContextType } from "@/auth/authProvider";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";
import type { Web3ContextType } from "#/forms/web3-context";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import "../styles.css";
interface RouterContext {
  queryClient: QueryClient
  auth: AuthContextType
  web3: Web3ContextType
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
        <Toaster />
      </main>
      <Footer />
    </>
  );
}
