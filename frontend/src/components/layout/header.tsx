import { useAuth } from "#/auth/authProvider";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "@tanstack/react-router";

function Header() {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <NavigationMenu className="min-h-(--header-height) w-full max-w-none border-b bg-background flex justify-between">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Button variant="link"><Link to="/">CryptoAction KYC Application</Link></Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            {isAuthenticated ? (
              <Button variant="link" onClick={() => logout()}>Logout</Button>
            ) : (
              <Button variant="link" onClick={() => login()}>Login</Button>
            )}
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator />
    </NavigationMenu>
  );
}

export default Header;
