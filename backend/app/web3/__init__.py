from web3 import Web3

from ..config import ETHEREUM_NODE_URL

w3 = None


def init_web3():
    global w3
    w3 = Web3(Web3.HTTPProvider(ETHEREUM_NODE_URL))
    if not w3.is_connected():
        raise ConnectionError("Failed to connect to Ethereum node")
    return w3
