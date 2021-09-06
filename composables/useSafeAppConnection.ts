import { useWeb3 } from "@instadapp/vue-web3";
import { injected } from "../connectors";
import { onMounted, ref, watch } from "@nuxtjs/composition-api";
import { SafeAppConnector } from "@gnosis.pm/safe-apps-web3-react";

export function useSafeAppConnection(connector?: SafeAppConnector) {
  const { activate, active } = useWeb3();

  const tried = ref(false);

  onMounted(() => {
    connector?.isSafeApp().then((loadedInSafe: boolean) => {
      if (loadedInSafe) {
        activate(connector, undefined, true).catch(() => {
          tried.value = true;
        });
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