import { submitKYCApplicationAPI } from "@/api/kyc";
import { ABI } from "@/config/contract";
import { ETHEREUM_DATA } from "@/config/vars";
import { config } from '@/config/wagmi';
import { cidCalculator } from "@/lib/cid-calculator";
import { type KYCApplicationSubmit, KYCApplicationSubmitToHash } from "@/types/kyc";
import stableStringify from "json-stable-stringify";
import { writeContract } from 'wagmi/actions';


export async function generateDigest(value: KYCApplicationSubmitToHash) {
    const encoder = new TextEncoder();
    const data = encoder.encode(stableStringify(value));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashHex = `0x${new Uint8Array(hashBuffer).toHex()}`;
    return hashHex;
}

export async function submitKYCApplication(value: KYCApplicationSubmit) {
    const cid = await cidCalculator(value.idFile);

    const applicationToHash: KYCApplicationSubmitToHash = {
        ...value,
        idFileHash: cid,
    };

    const digest = await generateDigest(KYCApplicationSubmitToHash.parse(applicationToHash));
    const tx = await writeContract(config, { abi: ABI, address: ETHEREUM_DATA.contractAddress, functionName: "createKYCApplication", args: [digest as '0x${string}'] });
    console.log('submitted application to blockchain with transaction:', tx);

    return submitKYCApplicationAPI(value);
}

// Records the KYC evaluator's decision on-chain (signed by the connected admin wallet) before the
// backend is asked to persist the decision.
// TODO: Expiration date has to go on-chain
export async function decideKYCOnChain(userAddress: string, isAccepted: boolean, adminAddress: `0x${string}`) {
    const tx = await writeContract(config, {
        abi: ABI,
        address: ETHEREUM_DATA.contractAddress,
        functionName: "decideKYC",
        args: [userAddress as `0x${string}`, isAccepted],
        account: adminAddress
    });
    console.log('submitted KYC decision to blockchain with transaction:', tx);
    return tx;
}
