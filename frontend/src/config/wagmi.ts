import { createConfig, http } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { cryptoaction } from '../web3/chain';

export const config = createConfig({
  chains: [cryptoaction],
  transports: {
    [cryptoaction.id]: http(),
  },
  connectors: [
    metaMask(),
  ],
});