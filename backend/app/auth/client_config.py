import os
from fastapi.security import OAuth2AuthorizationCodeBearer

OIDC_URL = os.environ.get("OIDC_URL", "http://localhost:8080")
REALM = os.environ.get("REALM", "cryptoaction")
CLIENT_ID = os.environ.get("CLIENT_ID", "cryptoaction-backend")

OpenIdConnectUrl = f"{OIDC_URL}/realms/{REALM}/.well-known/openid-configuration"
OIDCAuthorizationUrl = f"{OIDC_URL}/realms/{REALM}/protocol/openid-connect/auth"
OIDCTokenUrl = f"{OIDC_URL}/realms/{REALM}/protocol/openid-connect/token"

oidc = OAuth2AuthorizationCodeBearer(
    authorizationUrl=OIDCAuthorizationUrl,
    tokenUrl=OIDCTokenUrl,
    scopes={
        "User": "User access",
        "Admin": "Admin access",
    },
)
