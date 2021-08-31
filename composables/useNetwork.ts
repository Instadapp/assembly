import { computed, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { useLocalStorage } from "vue-composable";

import MainnetSVG from "~/assets/icons/mainnet.svg?inline";
import PolygonSVG from "~/assets/icons/polygon.svg?inline";
import { useModal } from "./useModal";
import { useNotification } from "./useNotification";
import { useWeb3 } from "@kabbouchi/vue-web3";

export enum Network {
  Mainnet = "mainnet",
  Polygon = "polygon"
}

export const networks = [
  { id: "mainnet", chainId: 1, name: "Mainnet", icon: MainnetSVG },
  { id: "polygon", chainId: 137, name: "Polygon", icon: PolygonSVG }
];

export const activeNetworkId = ref<Network>();
export const activeNetwork = computed(
  () => networks.find(n => n.id === activeNetworkId.value) || networks[0]
);

export function useNetwork() {
  const { showWarning } = useNotification();
  const { account, chainId } = useWeb3();
  const { showNetworksMismatchDialog } = useModal();

  const networkMismatch = computed(
    () => chainId.value != activeNetwork.value?.chainId
  );

  const checkForNetworkMismatch = () => {
    if (networkMismatch.value) {
      showNetworksMismatchDialog();
    }
  };

  async function switchToMainnet() {
    if (window.ethereum) {
      const chainData = {
        chainId: "0x1"
      };

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [chainData]
        });
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }

  async function switchToPolygon() {
    if (window.ethereum) {
      const chainId = "0x89";

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }]
        });
      } catch (switchError) {
        // 4902 error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            const chainData = {
              chainId,
              chainName: "Matic(Polygon) Mainnet",
              nativeCurrency: {
                name: "Matic",
                symbol: "MATIC",
                decimals: 18
              },
              rpcUrls: ["https://rpc-mainnet.matic.network"],
              blockExplorerUrls: ["https://polygonscan.com/"]
            };
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [chainData, account.value]
            });
          } catch (addError) {
            return Promise.reject(addError);
          }
        } else {
          return Promise.reject(switchError);
        }
      }
    }
  }

  async function switchNetwork() {
    try {
      if (activeNetworkId.value === "mainnet") {
        await switchToMainnet();
      } else {
        await switchToPolygon();
      }
      return Promise.resolve();
    } catch (error) {
      showWarning("Failed to switch network");
      return Promise.reject(error);
    }
  }

  watch(activeNetworkId, () => {
    localStorage.setItem("network", activeNetworkId.value);
  });

  onMounted(() => {
    if (activeNetworkId.value) {
      return;
    }
    //@ts-ignore
    activeNetworkId.value = localStorage.getItem("network") || "mainnet";

    // refreshWeb3()
  });

  return {
    networkMismatch,
    networks,
    activeNetworkId,
    activeNetwork,
    switchNetwork,
    checkForNetworkMismatch
  };
}
