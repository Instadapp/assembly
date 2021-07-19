import { onMounted, ref } from "@nuxtjs/composition-api";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

let web3Modal: Web3Modal;
let web3Provider: any;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "4a22c748450749e49ca8124355fff52d"
    }
  }
};

const active = ref(false);
const chainId = ref<number>();
const account = ref<string>();
const web3 = ref<Web3>();

export function useWeb3() {
  onMounted(async () => {
    if (web3Modal) {
      return;
    }

    web3Modal = new Web3Modal({
      disableInjectedProvider: false,
      cacheProvider: true,
      providerOptions
    });

    if (web3Modal.cachedProvider) {
      await activate();
    }
  });

  const activate = async () => {
    web3Provider = await web3Modal.connect();
    active.value = true;
    if (web3Provider.selectedAddress) {
      account.value = web3Provider.selectedAddress;
    } else if (web3Provider.accounts && web3Provider.accounts.length) {
      account.value = web3Provider.accounts[0];
    }
    let newWeb3 = new Web3(web3Provider);
    chainId.value = await newWeb3.eth.getChainId();
    web3.value = newWeb3;
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
        console.log("e");
      }
    }
    web3Modal.clearCachedProvider();
    web3Provider = undefined;
    active.value = false;
    web3.value = undefined;
    account.value = undefined;
    chainId.value = undefined;
  };

  return {
    chainId,
    web3,
    active,
    activate,
    deactivate
  };
}
