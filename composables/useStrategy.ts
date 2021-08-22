import { nextTick, onMounted, ref, watch } from "@nuxtjs/composition-api";
import { buildStrategy, DefineStrategy, IStrategy } from "~/core/strategies";
import { useBalances } from "./useBalances";
import { useDSA } from "./useDSA";
import { useWeb3 } from "./useWeb3";

export function useStrategy(defineStrategy: DefineStrategy) {
  const { web3, networkName } = useWeb3();
  const { dsa } = useDSA();
  const { prices, balances } = useBalances();

  const strategy = buildStrategy(defineStrategy);
  const inputs = ref(strategy.getInputs());
  const error = ref("");

  strategy.onUpdated(async () => {
    await nextTick();

    inputs.value = strategy.getInputs();
  });

  const submit = async () => {
    try {
      await strategy.submit();
    } catch (e) {
      error.value = e.message;
    }
  };

  watch(web3, () => strategy.setWeb3(web3.value), { immediate: true });
  watch(dsa, () => strategy.setDSA(dsa.value), { immediate: true });
  watch(
    prices,
    () => strategy.setProps({ prices: prices[networkName.value] }),
    { immediate: true }
  );
  watch(
    balances,
    () => {
      strategy.setProps({
        dsaTokens: balances.dsa[networkName.value],
        userTokens: balances.user[networkName.value]
      });
    },
    { immediate: true }
  );

  // testing
  onMounted(() => {
    //@ts-ignore
    window.strategy = strategy;
  });

  return {
    strategy,
    inputs,
    submit,
    error,
  };
}
