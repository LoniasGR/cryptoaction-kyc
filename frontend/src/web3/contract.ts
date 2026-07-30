import { ABI } from "@/config/contract";
import type { Account, GetContractReturnType } from "viem";
import type { ExtendedClient } from "./viemClient";

export async function applyForKYC(contract: GetContractReturnType<typeof ABI>, client: ExtendedClient, account: Account): Promise<void> {
const { request } = await client.simulateContract({
  account,
  address: contract.address,
  abi: ABI,
  functionName: 'createKYCApplication',
  args: [account.address],
});
await client.writeContract(request);
}