import { setWeb3LibraryCallback } from "@kabbouchi/vue-web3";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import Web3 from "web3";

setWeb3LibraryCallback(provider => new Web3(provider));

export const injected = new InjectedConnector({
  supportedChainIds: [1, 137]
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
    137: "https://rpc-mainnet.maticvigil.com"
  },
  supportedChainIds: [1, 137]
});
