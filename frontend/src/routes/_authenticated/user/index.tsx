import { UserPage } from "@/components/pages/user-page/index";
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/user/')({
  component: UserPage
});
