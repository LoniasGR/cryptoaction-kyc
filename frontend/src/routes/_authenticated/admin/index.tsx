import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/pages/admin-page/admin-page";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminPage,
});
