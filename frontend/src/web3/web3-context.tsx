import { ABI } from "@/config/contract";
import { ETHEREUM_DATA } from "@/config/vars";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getContract, type GetContractReturnType } from 'viem';
import { createClient, type ExtendedClient } from "./viemClient";
export interface Web3ContextType {
  client: ExtendedClient | null;
  isConnected: boolean;
  contract: GetContractReturnType<typeof ABI> | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {

  const [client, setClient] = useState<ExtendedClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState<GetContractReturnType<typeof ABI> | null>(null);

  const connect = async () => {
    const client = createClient();
    const contractInstance = getContract({
      abi: ABI,
      address: ETHEREUM_DATA.contractAddress,
      client: client,
    });
    setContract(contractInstance);
    setClient(client);
    setIsConnected(true);
  };


  useEffect(() => {
    connect()
      .catch((error) => {
        console.error("Failed to initialize Web3 provider:", error);
      });
  }, []);

  const value = useMemo<Web3ContextType>(
    () => ({
      client,
      isConnected,
      contract,
    }),
    [client, isConnected, contract],
  );

  return <Web3Context value={value}>{children}</Web3Context>;
}

export function useWeb3() {
  const context = useContext(Web3Context);

  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }

  return context;
}
