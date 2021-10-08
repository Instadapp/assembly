import { computed } from "@nuxtjs/composition-api";
import { useNetwork } from "./useNetwork";

export function useLink() {
  const { activeNetworkId } = useNetwork();

  const addressDetailsLink = computed(() => {
    if (activeNetworkId.value === "polygon") {
      return "https://polygonscan.com/address";
    }
    if (activeNetworkId.value === "arbitrum") {
      return "https://arbiscan.io/address";
    }

    return "https://etherscan.io/address";
  });

  return { addressDetailsLink };
}

export const getEtherscanLink = transactionHash =>
  `https://etherscan.io/tx/${transactionHash}`;
export const getMaticLink = transactionHash =>
  `https://polygonscan.com/tx/${transactionHash}`;
export const getPolygonLink = transactionHash =>
  `https://polygonscan.com/tx/${transactionHash}`;
export const getArbitrumLink = transactionHash =>
  `https://arbiscan.io/tx/${transactionHash}`;
export const getTenderlyLink = simulationId =>
  `https://dashboard.tenderly.co/public/InstaDApp/dsa-simulations/fork-simulation/${simulationId}?hideSidebar=true`;
