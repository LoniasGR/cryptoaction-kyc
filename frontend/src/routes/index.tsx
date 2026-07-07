import { useAuth } from '@/auth/authProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/admin' });
    }
  }, [isAuthenticated, navigate]);

  return (
    <Card className="mx-auto mt-20 flex flex-col items-center justify-center gap-4 max-w-200 self-center">
      <h1 className="text-4xl font-bold mb-15">Welcome to CryptoAction</h1>
      <Button onClick={() => login()}>
        Login
      </Button>
    </Card>
  );
}
