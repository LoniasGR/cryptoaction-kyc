import { ETHEREUM_DATA } from "@/config/vars";
import { createTestClient, http, publicActions, walletActions } from 'viem';
import { hardhat } from 'viem/chains';

export const createClient = () => createTestClient({ chain: hardhat, mode: "hardhat", transport: http(ETHEREUM_DATA.providerUrl) })
    .extend(publicActions)
    .extend(walletActions);

export type ExtendedClient = ReturnType<typeof createClient>;