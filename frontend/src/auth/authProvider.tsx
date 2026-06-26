import { createContext, useContext, useEffect, useState } from 'react';
import { keycloak } from '@/auth/keycloak';
import { type KeycloakUserInfo } from 'keycloak-js';
type AuthContextType = {
  isAuthenticated: boolean;
  userInfo?: KeycloakUserInfo;
  token?: string;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<KeycloakUserInfo | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    keycloak.init({ pkceMethod: "S256" })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        if (authenticated) {
          setToken(keycloak.token);
          setUserInfo(keycloak.userInfo);
          setIsAuthenticated(true);
          console.log('Authenticated:', authenticated);
          console.log('Token:', keycloak.refreshTokenParsed);
          console.log('User Info:', userInfo);
          // You can store the token, refreshToken, and userInfo in your state or context here
        }
      }).catch((error) => {
        console.error('Keycloak initialization error:', error);
      });
  }, []);

  return (
    <AuthContext value={{ isAuthenticated, userInfo, token, login: keycloak.login, logout: keycloak.logout }}>
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