import { computed, readonly, ref, watch } from "@nuxtjs/composition-api";

//@ts-ignore
import MainnetSVG from "~/assets/icons/mainnet.svg?inline";
//@ts-ignore
import PolygonSVG from "~/assets/icons/polygon.svg?inline";

export enum Network {
  Mainnet = "mainnet",
  Polygon = "polygon"
}

const networks = [
  { id: "mainnet", chainId: 1, name: "Mainnet", icon: MainnetSVG },
  { id: "polygon", chainId: 136, name: "Polygon", icon: PolygonSVG }
];

const activeNetworkId = ref<Network>(Network.Polygon);
const activeNetwork = computed(
  () => networks.find(n => n.id === activeNetworkId.value) || networks[0]
);

export function useNetwork() {
  return {
    networks,
    activeNetworkId,
    activeNetwork
  };
}
