import { useWeb3 } from "@instadapp/vue-web3";
import { ref, useContext, watch } from "@nuxtjs/composition-api";
import addresses from "~/constant/addresses";
import tokens from "~/constant/tokens";
import { useDSA } from "../useDSA";
import yearnV2ABI from "~/abis/read/yearnV2.json";
import useEventBus from "../useEventBus";
import BigNumber from "bignumber.js";
import { useBigNumber } from "../useBigNumber";

const resolver = addresses.mainnet.resolver.yearnV2;

const wantAddresses = tokens.mainnet.allTokens.map((token) => token.address);

const vaults = ref([]);

export function useYearnV2Position() {
  const { $axios } = useContext();
  const { times } = useBigNumber();
  const { library } = useWeb3();
  const { activeAccount } = useDSA();
  const { onEvent } = useEventBus();

  const fetchPosition = async () => {
    const availableVaults = await $axios
      .$get("https://api.yearn.finance/v1/chains/1/vaults/all")
      .then(vs => vs.filter(v => v.type === "v2"));

    if (!library.value) {
      return;
    }

    if (!activeAccount.value) {
      return;
    }

    const resolverInstance = new library.value.eth.Contract(
      yearnV2ABI as any,
      resolver
    );

    const tokensArr = wantAddresses; // tokens.mainnet.allTokens.map(a => a.address);

    const rawData = await resolverInstance.methods
      .getPositionsForLatest(activeAccount.value.address, tokensArr)
      .call();

    const newVaults = [];

    rawData.forEach(
      ([
        vaultLatestVersion,
        vault,
        want,
        pricePerShare,
        availableDepositLimit,
        totalAssets,
        balanceOf,
        wantBalanceOf,
        expectedShareValue,
        decimals,
        isDeprecated,
        emergencyShutdown
      ]) => {
        const v = availableVaults.find(v => v.address === vault);
        if (v) {
          const supply = new BigNumber(balanceOf)
          .dividedBy(10 ** decimals)
          .toFixed();

          newVaults.push({
            ...v,
            priceInUsd: v.tvl.price.toString(),
            position: {
              vaultLatestVersion,
              vault,
              want,
              pricePerShare,
              availableDepositLimit,
              totalAssets,
              balanceOf,
              wantBalanceOf,
              expectedShareValue,
              decimals,
              isDeprecated,
              emergencyShutdown,
              supply,
              supplyUsd: times(supply, v.tvl.price).toFixed(),
            }
          });
        }
      }
    );
    vaults.value = newVaults;
  };

  const refreshPosition = async () => {
    await fetchPosition();
  };

  onEvent("protocol::compound::refresh", refreshPosition);

  watch(
    library,
    async val => {
      if (val) {
        refreshPosition();
      }
    },
    { immediate: true }
  );

  watch(
    activeAccount,
    async val => {
      if (val) {
        refreshPosition();
      }
    },
    { immediate: true }
  );

  return {
    vaults,
    refreshPosition
  };
}
