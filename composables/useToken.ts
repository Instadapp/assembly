import { computed } from "@nuxtjs/composition-api";
import atokensV2 from "~/constant/atokensV2";
import tokens from "~/constant/tokens";
import { useBigNumber } from "./useBigNumber";
import { useWeb3 } from "./useWeb3";

export function useToken() {
  const { networkName } = useWeb3();
  const { toBN, times, minus, div, pow } = useBigNumber();

  const getTokenByKey = key =>
    tokens[networkName.value].allTokens.find(
      token => String(token.key).toLowerCase() === String(key).toLowerCase()
    );

  const allATokensV2 = computed(() => atokensV2[networkName.value].allTokens);

  function valInt(val, decimals) {
    const num = toBN(val);
    const multiplier = pow(10, decimals);
    return times(num, multiplier).toFixed(0);
  }

  return {
    getTokenByKey,
    allATokensV2,
    valInt
  };
}
