import { computed } from "@nuxtjs/composition-api";
import atokensV2 from "~/constant/atokensV2";
import tokens from "~/constant/tokens";
import { useWeb3 } from "./useWeb3";

export function useToken() {
  const { networkName } = useWeb3();

  const getTokenByKey = key =>
    tokens[networkName.value].allTokens.find(
      token => String(token.key).toLowerCase() === String(key).toLowerCase()
    );

  const allATokensV2 = computed(() => atokensV2[networkName.value].allTokens);

  return {
    getTokenByKey,
    allATokensV2
  };
}
