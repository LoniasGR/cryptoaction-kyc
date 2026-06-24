import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import keycloak from "./keycloak";

type AuthContextType = {
  initialized: boolean;
  authenticated: boolean;
  token?: string;
  login: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    let refreshInterval: number | undefined;

    keycloak
      .init({
        onLoad: "check-sso", // use "login-required" if you want forced login
        pkceMethod: "S256",
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(auth);
        setToken(keycloak.token);

        // refresh token every 20s (only if needed)
        refreshInterval = window.setInterval(async () => {
          try {
            const refreshed = await keycloak.updateToken(30); // refresh if expiring in 30s
            if (refreshed) setToken(keycloak.token);
          } catch {
            setAuthenticated(false);
            setToken(undefined);
          }
        }, 20000);
      })
      .finally(() => setInitialized(true));

    return () => {
      if (refreshInterval) window.clearInterval(refreshInterval);
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      initialized,
      authenticated,
      token,
      login: () => keycloak.login(),
      logout: () => keycloak.logout({ redirectUri: window.location.origin }),
      hasRole: (role: string) => !!keycloak.tokenParsed?.realm_access?.roles?.includes(role),
    }),
    [initialized, authenticated, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}