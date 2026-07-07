import httpx
import jwt
from cachetools import TTLCache, cached
from .client_config import OpenIdConnectUrl

CACHE_TTL = 600  # seconds


@cached(cache=TTLCache(maxsize=1, ttl=CACHE_TTL))
def get_discovery_configuration():
    oidc_config = httpx.get(OpenIdConnectUrl)

    oidc_config.raise_for_status()

    return oidc_config.json()


@cached(TTLCache(maxsize=1, ttl=CACHE_TTL), key=lambda d: d["jwks_uri"])
def create_pyjwt_client_from_oidc_spec(oidc_config):
    return jwt.PyJWKClient(oidc_config["jwks_uri"])


@cached(
    TTLCache(maxsize=1, ttl=CACHE_TTL),
    key=lambda d: str(d["id_token_signing_alg_values_supported"]),
)
def get_signing_algos(oidc_config):
    algos = oidc_config["id_token_signing_alg_values_supported"]
    return algos
