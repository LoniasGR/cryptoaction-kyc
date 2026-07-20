  import { createContext, useContext, useEffect, useState } from 'react';
  import { keycloak } from '@/auth/keycloak';
  import { type KeycloakLoginOptions, type KeycloakUserInfo } from 'keycloak-js';
import { backendClientId } from '#/config/vars';

  export type AuthContextType = {
    isAuthenticated: boolean;
    isInitialized: boolean;
    userInfo?: KeycloakUserInfo;
    token?: string;
    login: (options?: KeycloakLoginOptions) => void;
    logout: () => void;
    hasRole: (role: string) => boolean;
  };

  export const AuthContext = createContext<AuthContextType | undefined>(undefined);

  const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<KeycloakUserInfo | undefined>(undefined);
    const [token, setToken] = useState<string | undefined>(undefined);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
      keycloak.init({ onLoad: 'check-sso', pkceMethod: "S256" })
        .then(async (authenticated) => {
          setIsInitialized(true);
          console.log('Keycloak initialized. Authenticated:', authenticated);
          setIsAuthenticated(authenticated);
          if (authenticated) {
            setToken(keycloak.token);
            const profile = await keycloak.loadUserInfo();
            setUserInfo(profile);
            setIsAuthenticated(true);
          }
        }).catch((error) => {
          console.error('Keycloak initialization error:', error);
        });
    }, []);

    const hasRole = (role: string) => {
      return keycloak.hasResourceRole(role, backendClientId);
    };

    return (
      <AuthContext value={{
        isAuthenticated,
        isInitialized,
        userInfo,
        token,
        login: keycloak.login,
        logout: keycloak.logout,
        hasRole
      }}>
        {children}
      </AuthContext>
    );
  };

  const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };

  export { AuthProvider, useAuth };