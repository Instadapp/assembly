import { computed, onMounted, ref } from "@nuxtjs/composition-api";
import Web3 from "web3";
import { SafeAppWeb3Modal } from "@gnosis.pm/safe-apps-web3modal";
import { Network } from "./useNetwork";

let web3Modal: SafeAppWeb3Modal;
let web3Provider: any;

let providerOptions = {};

const chains = [
  {
    name: "mainnet" as Network,
    chainId: 1,
    displayName: "Mainnet"
  },
  {
    name: "polygon" as Network,
    chainId: 137,
    node: "https://rpc-mainnet.matic.network",
    displayName: "Polygon"
  }
];

const active = ref(false);
const chainId = ref<1 | 137>();
const networkName = computed<Network>(
  () => chains.find(c => c.chainId === chainId.value)?.name || Network.Mainnet
);
const account = ref<string>();
const web3 = ref<Web3>();

export function setProviders(providers: any) {
  providerOptions = providers;
}

export function useWeb3() {
  onMounted(async () => {
    if (web3Modal) {
      return;
    }

    web3Modal = new SafeAppWeb3Modal({
      cacheProvider: true,
      providerOptions
    });
    
    //@ts-ignore
    window.web3Modal = web3Modal;

    if (web3Modal.cachedProvider) {
      await activate();
    }

    if (await web3Modal.isSafeApp()) {
      await activate();
    }
  });

  const activate = async () => {
    web3Provider = await web3Modal.requestProvider();
    active.value = true;
    if (web3Provider.selectedAddress) {
      account.value = web3Provider.selectedAddress;
    } else if (web3Provider.accounts && web3Provider.accounts.length) {
      account.value = web3Provider.accounts[0];
    }
    let newWeb3 = new Web3(web3Provider);
    //@ts-ignore
    chainId.value = await newWeb3.eth.getChainId();
    web3.value = newWeb3;

    setProvider(web3Provider);
  };

  const deactivate = async () => {
    if (
      web3.value &&
      web3.value.currentProvider &&
      typeof web3.value.currentProvider === "object"
    ) {
      //@ts-ignore
      if (typeof web3.value.currentProvider.disconnect === "function") {
        //@ts-ignore
        web3.value.currentProvider.disconnect();
      }
    }
    web3Modal.clearCachedProvider();
    web3Provider = undefined;
    active.value = false;
    web3.value = undefined;
    account.value = undefined;
    chainId.value = undefined;
  };

  const setProvider = provider => {
    if (web3Modal.cachedProvider === "walletconnect") {
      provider.on("accountsChanged", () => {
        location.reload();
      });

      // Subscribe to networkId change
      provider.on("networkChanged", () => {
        location.reload();
      });

      // Subscribe to session connection/open
      provider.on("open", () => {
        location.reload();
      });

      // Subscribe to session disconnection/close
      provider.on("close", () => {
        location.reload();
      });
    }

    // Subscribe to chainId change
    provider.on("chainChanged", refreshWeb3);
    provider.on("accountsChanged", refreshWeb3);
  };

  const refreshWeb3 = async () => {
    if (!web3Provider) {
      return;
    }
    let newWeb3 = new Web3(web3Provider);
    //@ts-ignore
    chainId.value = await newWeb3.eth.getChainId();
    web3.value = newWeb3;
  };

  const setWeb3 = (newWeb3: Web3) => {
    web3.value = newWeb3;
  };

  return {
    account,
    chainId,
    web3,
    active,
    activate,
    deactivate,
    networkName,
    refreshWeb3,
    setWeb3
  };
}
