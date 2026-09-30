import { defineChain } from 'viem';

export const cryptoaction = defineChain({
  id: 31337,
  name: 'Cryptoaction',
  nativeCurrency: {
    decimals: 18,
    name: 'CToken',
    symbol: 'CRY',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  testnet: true,
});