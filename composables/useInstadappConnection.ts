import { useWeb3 } from "@instadapp/vue-web3";
import { onMounted, ref, watch } from "@nuxtjs/composition-api";
import { Network, useNetwork } from "./useNetwork";
import { InstadappConnector } from "~/connectors/instadapp";

export function useInstadappConnection(connector?: InstadappConnector) {
  const { activate, active } = useWeb3();
  const { activeNetworkId} = useNetwork();

  const tried = ref(false);

  onMounted(() => {
    connector?.isInstadapp().then(async (loaded: boolean) => {
      if (loaded) {
        await activate(connector, undefined, true).catch(() => {
          tried.value = true;
        });

        activeNetworkId.value = (await connector.getChainId() === 1) ? Network.Mainnet : Network.Polygon;
      } else {
        tried.value = true;
      }
    });
  });

  // if the connection worked, wait until we get confirmation of that to flip the flag
  watch([tried, active], () => {
    if (!tried.value && active.value) {
      tried.value = true;
    }
  });

  return {
    tried
  };
}