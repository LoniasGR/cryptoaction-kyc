import { KEYCLOAK_DATA } from "@/config/vars";
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: KEYCLOAK_DATA.url,
  realm: KEYCLOAK_DATA.realm,
  clientId: KEYCLOAK_DATA.clientId,
});

export default keycloak;