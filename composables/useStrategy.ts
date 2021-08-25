import { nextTick, onMounted, ref, watch } from "@nuxtjs/composition-api";
import tokens from "~/constant/tokens";
import { buildStrategy, DefineStrategy, IStrategy } from "~/core/strategies";
import { useBalances } from "./useBalances";
import { useDSA } from "./useDSA";
import useEventBus from "./useEventBus";
import { useNotification } from "./useNotification";
import { useSidebar } from "./useSidebar";
import { useToken } from "./useToken";
import { useWeb3 } from "./useWeb3";
export function useStrategy(defineStrategy: DefineStrategy) {
  const { web3, networkName, account } = useWeb3();
  const { dsa } = useDSA();
  const { prices, balances, fetchBalances } = useBalances();
  const { close } = useSidebar();
  const { valInt, getTokenByKey } = useToken();
  const { emitEvent } = useEventBus();
  const {
    showPendingTransaction,
    showConfirmedTransaction
  } = useNotification();

  const strategy = buildStrategy(defineStrategy);
  const inputs = ref(strategy.inputs);
  const error = ref("");
  const pending = ref(false);

  strategy.onUpdated(async () => {
    await nextTick();

    inputs.value = strategy.inputs;

    console.log("onUpdated");
  });

  const submit = async () => {
    error.value = "";
    pending.value = true;
    try {
      const tx = await strategy.submit({
        onReceipt: async () => {
          showConfirmedTransaction(tx);
          await fetchBalances(true);

          emitEvent(`protocol::${strategy.schema.protocol}::refresh`,{});
        },
        from: account.value
      });
      showPendingTransaction(tx);
      close();
    } catch (e) {
      console.error(e);
      
      error.value = e.message;
    }
    pending.value = false;
  };

  strategy.setProps({
    convertTokenAmountToBigNumber: valInt,
    getTokenByKey,
  })

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
  watch(
    networkName,
    () =>
      strategy.setProps({
        tokens: tokens[networkName.value].allTokens,
        tokenKeys: tokens[networkName.value].tokenKeys
      }),
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
    pending,
  };
}
