import { setWeb3LibraryCallback } from "@instadapp/vue-web3";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
// import { LedgerConnector } from "@web3-react/ledger-connector";
import { LedgerConnector } from "./ledger-connector";

import INSTADAPP_LOGO_URL from "~/assets/logo/instadapp-logo-icon.svg?inline";

import Web3 from "web3";
import { SafeAppConnector } from "@gnosis.pm/safe-apps-web3-react/dist/connector";

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

// mainnet only
export const portis = new PortisConnector({
  dAppId: process.env.PORTIS_ID as string,
  networks: [1]
});

export const walletlink = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
  appName: "Instadapp",
  appLogoUrl: INSTADAPP_LOGO_URL
});

let gnosisSafe = null;

if (process.client) {
  gnosisSafe = new SafeAppConnector({
    supportedChainIds: [1, 137]
  });
}

export { gnosisSafe };

const POLLING_INTERVAL = 12000;

export enum LedgerDerivationPath {
  "Legacy" = "44'/60'/0'/x",
  "LedgerLive" = "44'/60'/x'/0/0"
}

export const ledger = new LedgerConnector({
  chainId: 1,
  url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
  requestTimeoutMs: 60000,
  pollingInterval: POLLING_INTERVAL,
  baseDerivationPath: "44'/60'/x'/0/0",
  accountsOffset: 0,
  accountsLength: 1
});
