from web3 import Web3

from ..config import ETHEREUM_CONTRACT_ADDRESS
from .contract_abi import abi

contract = None


def init_contract(w3):
    global contract
    contract = w3.eth.contract(
        address=Web3.to_checksum_address(ETHEREUM_CONTRACT_ADDRESS), abi=abi
    )


def getKycApplication(user_address):
    if contract is None:
        raise ValueError("Smart contract not found. This is an error.")
    return contract.functions.getKYCApplication(user_address).call()


def getAllKycApplications():
    if contract is None:
        raise ValueError("Smart contract not found. This is an error.")
    return contract.functions.getAllKycApplications().call()


def getKycStatus(user_address):
    if contract is None:
        raise ValueError("Smart contract not found. This is an error.")
    return contract.functions.getKYCStatus(user_address).call()


def getAllApplicationsByStatus(status: int):
    if contract is None:
        raise ValueError("Smart contract not found. This is an error.")
    return contract.functions.getAllKycByStatus(status).call()


def updateKycStatus(user_address, accepted: bool):
    if contract is None:
        raise ValueError("Smart contract not found. This is an error.")
    return contract.functions.decideKYC(user_address, accepted).transact()
