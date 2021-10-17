import { computed, watchEffect, ref, watch } from "@nuxtjs/composition-api";

import MainnetSVG from "~/assets/icons/mainnet.svg?inline";
import PolygonSVG from "~/assets/icons/polygon.svg?inline";
import ArbitrumSVG from "~/assets/icons/arbitrum.svg?inline";

import { useModal } from "./useModal";
import { useNotification } from "./useNotification";
import { useWeb3 } from "@instadapp/vue-web3";
import { useCookies } from "./useCookies";

export enum Network {
  Mainnet = "mainnet",
  Polygon = "polygon",
  Arbitrum = "arbitrum",
  Avalanche = "avalanche"
}

export const networks = [
  { id: "mainnet", chainId: 1, name: "Mainnet", icon: MainnetSVG },
  { id: "polygon", chainId: 137, name: "Polygon", icon: PolygonSVG },
  { id: "arbitrum", chainId: 42161, name: "Arbitrum", icon: ArbitrumSVG },
  { id: "avalanche", chainId: 43114, name: "Avalanche", icon: ArbitrumSVG },
];

export const activeNetworkId = ref<Network>();
export const activeNetwork = computed(
  () => networks.find(n => n.id === activeNetworkId.value) || networks[0]
);

export function useNetwork() {
  const { showWarning } = useNotification();
  const { account, chainId } = useWeb3();
  const { showNetworksMismatchDialog } = useModal();
  const { get: getCookie, set: setCookie } = useCookies();

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

  async function switchToArbitrum() {
    if (window.ethereum) {
      const chainId = "0xa4b1";

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
              chainName: 'Arbitrum One',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://arb1.arbitrum.io/rpc'],
              blockExplorerUrls: ['https://arbiscan.io'],
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

  async function switchToAvalanche() {
    if (window.ethereum) {
      const chainId = '0xa86a'

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        })
      } catch (switchError) {
        // 4902 error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            const chainData = {
              chainId,
              chainName: 'Avalanche Network',
              nativeCurrency: {
                name: 'Avalanche',
                symbol: 'AVAX',
                decimals: 18,
              },
              rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
              blockExplorerUrls: ['https://cchain.explorer.avax.network/'],
            }
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [chainData, account.value],
            })
          } catch (addError) {
            return Promise.reject(addError)
          }
        } else {
          return Promise.reject(switchError)
        }
      }
    }
  }

  async function switchNetwork() {
    try {
      if (activeNetworkId.value === "mainnet") {
        await switchToMainnet();
      } else if (activeNetworkId.value === "arbitrum") {
        await switchToArbitrum();
      } else if (activeNetworkId.value === "avalanche") {
        await switchToAvalanche();
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
    setCookie("network", activeNetworkId.value);
  });

  watchEffect(() => {
    if (activeNetworkId.value) {
      return;
    }

    const savedNetwork = getCookie("network");

    if ((Object.values(Network) as any[]).includes(savedNetwork)) {
      activeNetworkId.value = savedNetwork as Network;
    } else {
      activeNetworkId.value = Network.Mainnet;
    }
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
