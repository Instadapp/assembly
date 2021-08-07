import SVGCompound from "@/assets/logo/compound.svg?inline";
import SVGMakerDAO from "@/assets/logo/makerdao.svg?inline";
import SVGAave from "@/assets/logo/aave.svg?inline";
import SVGAaveV2 from "@/assets/logo/aave-v2.svg?inline";
import SVGUniswap from "@/assets/logo/uniswap.svg?inline";
import SVGInstadapp from "@/assets/logo/instadapp-logo-icon.svg?inline";
import SVGDefault from "@/assets/logo/default.svg?inline";
import { computed } from "@nuxtjs/composition-api";

const protocols = {
  makerdao: {
    title: "MakerDAO",
    logo: SVGMakerDAO,
    protocol: "makerdao",
    supportedNetworks: ["mainnet"]
  },
  compound: {
    title: "Compound",
    logo: SVGCompound,
    protocol: "compound",
    supportedNetworks: ["mainnet"]
  },
  aave: {
    title: "Aave",
    logo: SVGAave,
    protocol: "aave",
    supportedNetworks: ["mainnet"]
  },
  "aave-v2": {
    title: "Aave V2",
    logo: SVGAaveV2,
    protocol: "aave-v2",
    supportedNetworks: ["mainnet", "matic"]
  },
  uniswap: {
    title: "Uniswap",
    logo: SVGUniswap,
    protocol: "uniswap",
    supportedNetworks: ["mainnet"]
  },
  instadapp: {
    title: "Instadapp",
    logo: SVGInstadapp,
    protocol: "guniswap",
    supportedNetworks: ["mainnet"]
  },
  default: {
    title: "Balance",
    logo: SVGDefault,
    protocol: "default",
    supportedNetworks: ["mainnet"]
  }
};

export function useProtocolData(protocol) {
  protocol = String(protocol).toLowerCase();

  const data = computed(() => protocols[protocol]);
  const title = computed(() => (data.value ? data.value.title : null));
  const logo = computed(() => (data.value ? data.value.logo : null));

  const protocolName = computed(() =>
    data.value ? data.value.protocol : null
  );

  const leverageableProtocols = computed(() =>
    //@ts-ignore
    Object.values(protocols).filter(protocol => protocol.supportLeverageEth)
  );

  function networkIsSupported(network) {
    return data.value.supportedNetworks.includes(network);
  }

  return {
    title,
    logo,
    protocolName,
    leverageableProtocols,
    networkIsSupported
  };
}
