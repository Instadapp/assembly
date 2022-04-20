import { computed } from "@nuxtjs/composition-api";
import atokensV2 from "~/constant/atokensV2";
import atokensV3 from "~/constant/atokensV3";
import tokens from "~/constant/tokens";
import { useBigNumber } from "./useBigNumber";
import { useNetwork } from "./useNetwork";

export function useToken() {
  const { activeNetworkId } = useNetwork();
  const { toBN, times, minus, div, pow } = useBigNumber();

  const getTokenByKey = key =>
    tokens[activeNetworkId.value].allTokens.find(
      token => String(token.key).toLowerCase() === String(key).toLowerCase()
    );

  const allATokensV2 = computed(() => atokensV2[activeNetworkId.value].allTokens);
  const allATokensV3 = computed(() => atokensV3[activeNetworkId.value].allTokens);

  function valInt(val, decimals) {
    const num = toBN(val);
    const multiplier = pow(10, decimals);
    return times(num, multiplier).toFixed(0);
  }

  return {
    getTokenByKey,
    allATokensV2,
    allATokensV3,
    valInt
  };
}
