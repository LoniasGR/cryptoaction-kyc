import { UserPage } from "@/components/pages/user-page";
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/user')({
  component: UserPage
});

