import { useWeb3 } from "@instadapp/vue-web3";
import { injected, gnosisSafe } from "../connectors";
import { onMounted, ref, watch, watchEffect } from "@nuxtjs/composition-api";
import { useSafeAppConnection } from "./useSafeAppConnection";

export function useEagerConnect() {
  const { activate, active } = useWeb3();
  const { tried: triedToConnectToSafe } = useSafeAppConnection(gnosisSafe);
  const tried = ref(false);

  watchEffect(() => {
    if (triedToConnectToSafe.value && !active.value && !tried.value) {
      injected.isAuthorized().then((isAuthorized: boolean) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            tried.value = true;
          });
        } else {
          tried.value = true;
        }
      });
    }
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
