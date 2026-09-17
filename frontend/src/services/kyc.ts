import { submitKYCApplicationAPI } from "@/api/kyc";
import { applyForKYC } from "@/web3/contract";
import type { ABI } from "@/config/contract";
import { cidCalculator } from "@/lib/cid-calculator";
import { type KYCApplicationSubmit, KYCApplicationSubmitToHash } from "@/types/kyc";
import type { ExtendedClient } from "@/web3/viemClient";
import stableStringify from "json-stable-stringify";
import type { GetContractReturnType } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export async function generateDigest(value: KYCApplicationSubmitToHash) {
    const encoder = new TextEncoder();
    const data = encoder.encode(stableStringify(value));
    console.log("Generated digest input for application:", new TextDecoder().decode(data));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    console.log("Generated hash buffer:", hashBuffer);
    const hashHex = `0x${new Uint8Array(hashBuffer).toHex()}`;
    console.log("Generated hash hex:", hashHex);
    return hashHex;
}

export async function submitKYCApplication(value: KYCApplicationSubmit, contract: GetContractReturnType<typeof ABI>, client: ExtendedClient) {
    const account = privateKeyToAccount(value.blockchainAddress as `0x${string}`);

    value.blockchainAddress = account.address;
    const cid = await cidCalculator(value.idFile);

    const applicationToHash: KYCApplicationSubmitToHash = {
        ...value,
        idFileHash: cid,
    };

    const digest = await generateDigest(KYCApplicationSubmitToHash.parse(applicationToHash));

    await applyForKYC(contract, client, account, digest);
    return submitKYCApplicationAPI(value);
}
