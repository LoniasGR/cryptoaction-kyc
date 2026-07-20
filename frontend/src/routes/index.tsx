import { useAuth } from '@/auth/authProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  const { isAuthenticated, login, hasRole } = useAuth();
  const navigate = useNavigate();
  if (!isAuthenticated) {
    return (
      <Card className="mx-auto mt-20 flex flex-col items-center justify-center gap-4 max-w-200 self-center">
        <h1 className="text-4xl font-bold mb-15">Welcome to CryptoAction</h1>
        <Button onClick={() => login()}>
          Login
        </Button>
      </Card>
    );
  }
  return (
    <Card className="mx-auto mt-20 flex flex-col items-center justify-center gap-4 max-w-200 self-center">
      <h1 className="text-4xl font-bold mb-15">Welcome to CryptoAction</h1>
      <Button onClick={() => {
        navigate({ to: '/user' });
      }}>
        Apply for KYC
      </Button>
      { hasRole('Admin') && (
        <Button onClick={() => {
          navigate({ to: '/admin' });
        }}>
          Admin Dashboard
        </Button>
      )}
    </Card>
  );
}
