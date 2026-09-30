import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/pages/admin-page/admin-page";

export const Route = createFileRoute("/_authenticated/_wallet-connected/admin/")({
  component: AdminPage,
});
