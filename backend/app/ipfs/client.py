import aioipfs
from ..config import IPFS_MULTIADDR

ipfs_client = None


async def get_ipfs_client() -> aioipfs.AsyncIPFS:
    """
    Get an instance of the IPFS client.

    :return: An instance of the IPFS client.
    """
    global ipfs_client
    if ipfs_client is None:
        ipfs_client = aioipfs.AsyncIPFS(maddr=IPFS_MULTIADDR)
    return ipfs_client


async def add_file(bytes: bytes) -> str:
    """
    Add a file to IPFS.

    :param bytes: The bytes of the file to be added.
    :return: The IPFS hash of the added file.
    """
    client = await get_ipfs_client()
    file = await client.add_bytes(bytes)
    return file["Hash"]


async def get_file(ipfs_hash: str) -> bytes:
    """
    Get a file from IPFS.

    :param ipfs_hash: The IPFS hash of the file to be retrieved.
    :return: The bytes of the retrieved file.
    """
    client = await get_ipfs_client()
    file_bytes = await client.cat(ipfs_hash)
    return file_bytes
