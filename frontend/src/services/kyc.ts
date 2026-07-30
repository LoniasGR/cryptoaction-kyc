import type { KYCApplicationSubmit } from "@/types/kyc";
import { submitKYCApplicationAPI } from "@/api/kyc";
import type { ExtendedClient } from "@/web3/viemClient";
import type { ABI } from "@/config/contract";
import type { GetContractReturnType } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { applyForKYC } from "@/web3/contract";

export async function  submitKYCApplication(value: KYCApplicationSubmit, contract: GetContractReturnType<typeof ABI>, client: ExtendedClient) {
    const account = privateKeyToAccount(value.blockchainAddress as `0x${string}`);
    
    value.blockchainAddress = account.address;
    await submitKYCApplicationAPI(value);
    await applyForKYC(contract, client, account);
}