from typing_extensions import Annotated

from fastapi import HTTPException, Security, status
from fastapi.security import SecurityScopes
import jwt
from .client_config import oidc, CLIENT_ID as client_id
from .discovery import (
    get_discovery_configuration,
    get_signing_algos,
    create_pyjwt_client_from_oidc_spec,
)


def decode_token(auth_header: str):
    try:
        oidc_config = get_discovery_configuration()
        jwks_client = create_pyjwt_client_from_oidc_spec(oidc_config)

        # get signing_key from id_token
        signing_key = jwks_client.get_signing_key_from_jwt(auth_header)
        # now, decode_complete to get payload + header
        data = jwt.decode_complete(
            auth_header,
            key=signing_key,
            audience=client_id,
            algorithms=get_signing_algos(oidc_config),
        )
        return data["payload"], data["header"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {str(e)}"
        )


def validate_user(security_scopes: SecurityScopes, auth_header: str = Security(oidc)):
    payload, header = decode_token(auth_header)
    client_roles = set(
        payload.get("resource_access", {}).get(client_id, {}).get("roles", [])
    )

    scope_role_map = {
        "user": {"User", "Admin"},
        "admin": {"Admin"},
    }
    for scope in security_scopes.scopes:
        allowed_roles = scope_role_map.get(scope, set())
        if client_roles.isdisjoint(allowed_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing permission for scope '{scope}'",
            )
    return payload


def is_user_admin(user_payload: dict) -> bool:
    client_roles = set(
        user_payload.get("resource_access", {}).get(client_id, {}).get("roles", [])
    )
    return "Admin" in client_roles


userDependency = Annotated[
    dict,
    Security(
        validate_user,
        scopes=["user"],
    ),
]

adminDependency = Annotated[
    dict,
    Security(
        validate_user,
        scopes=["admin"],
    ),
]
