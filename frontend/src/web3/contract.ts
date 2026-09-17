import { ABI } from "@/config/contract";
import type { Account, GetContractReturnType } from "viem";
import type { ExtendedClient } from "./viemClient";
import type { Hex32Byte } from "@/types/kyc";

export async function applyForKYC(contract: GetContractReturnType<typeof ABI>, client: ExtendedClient, account: Account, digest: Hex32Byte): Promise<void> {
  console.log("digest:", digest);
  console.log("account:", account);
  const { request } = await client.simulateContract({
    account,
    address: contract.address,
    abi: ABI,
    functionName: 'createKYCApplication',
    args: [account.address, digest as '0x${string}'],
  });
  await client.writeContract(request);
}