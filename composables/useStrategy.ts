import {
  nextTick,
  onMounted,
  ref,
  watch,
  watchEffect
} from "@nuxtjs/composition-api";
import tokens from "~/constant/tokens";
import {
  buildStrategy,
  DefineStrategy,
  StrategyProtocol
} from "~/core/strategies";
import { position as aaveV2Position } from "./protocols/useAaveV2Position";
import { position as compoundPosition } from "./protocols/useCompoundPosition";
import { vault as makerPosition } from "./protocols/useMakerdaoPosition";
import {
  trove as liquityPosition,
  troveTypes,
  troveOverallDetails
} from "./protocols/useLiquityPosition";
import { useBalances } from "./useBalances";
import { useDSA } from "./useDSA";
import useEventBus from "./useEventBus";
import { useNotification } from "./useNotification";
import { useSidebar } from "./useSidebar";
import { useToken } from "./useToken";
import { useWeb3 } from "@instadapp/vue-web3";
import { useBigNumber } from "./useBigNumber";
import tokenIdMapping from "~/constant/tokenIdMapping";
import { useFormatting } from "./useFormatting";
import { useNetwork } from "./useNetwork";

export function useStrategy(defineStrategy: DefineStrategy) {
  const { library, account } = useWeb3();
  const { activeNetworkId } = useNetwork()
  const { dsa } = useDSA();
  const { prices, balances, fetchBalances } = useBalances();
  const { close } = useSidebar();
  const { valInt, getTokenByKey } = useToken();
  const { emitEvent } = useEventBus();
  const { toBN } = useBigNumber();
  const formatting = useFormatting();

  const {
    showPendingTransaction,
    showConfirmedTransaction
  } = useNotification();

  const strategy = buildStrategy(defineStrategy);
  const components = ref(strategy.components);
  const error = ref("");
  const pending = ref(false);

  // strategy.onUpdated(async () => {
  //   await nextTick();
  // });

  const submit = async () => {
    error.value = "";
    pending.value = true;
    try {
      const tx = await strategy.submit({
        onReceipt: async () => {
          showConfirmedTransaction(tx);
          await fetchBalances(true);

          emitEvent(`protocol::${strategy.schema.protocol}::refresh`, {});
        },
        from: account.value
      });
      showPendingTransaction(tx);
      close();
    } catch (e) {
      error.value = e.message;
    }
    pending.value = false;
  };

  watch(
    () => [
      aaveV2Position,
      makerPosition,
      compoundPosition,
      liquityPosition,
      troveTypes,
      troveOverallDetails
    ],
    () => {
      let position = null;
      let positionExtra = {};

      if (strategy.schema.protocol == StrategyProtocol.AAVE_V2) {
        position = aaveV2Position.value;
      } else if (strategy.schema.protocol == StrategyProtocol.MAKERDAO) {
        position = makerPosition.value;
      } else if (strategy.schema.protocol == StrategyProtocol.COMPOUND) {
        position = compoundPosition.value;
      } else if (strategy.schema.protocol == StrategyProtocol.LIQUITY) {
        position = liquityPosition.value;

        positionExtra["troveTypes"] = troveTypes.value;
        positionExtra["troveOverallDetails"] = troveOverallDetails.value;
      }

      strategy.setProps({
        convertTokenAmountToWei: valInt,
        getTokenByKey,
        toBN,
        position,
        positionExtra,
        tokenIdMapping,
        formatting
      });
    },
    { immediate: true }
  );

  watch(library, () => strategy.setWeb3(library.value), { immediate: true });
  watch(dsa, () => strategy.setDSA(dsa.value), { immediate: true });
  watch(
    prices,
    () => strategy.setProps({ prices: prices[activeNetworkId.value] }),
    { immediate: true }
  );
  watch(
    balances,
    () => {
      strategy.setProps({
        dsaBalances: balances.dsa[activeNetworkId.value],
        userBalances: balances.user[activeNetworkId.value]
      });
    },
    { immediate: true }
  );
  watch(
    activeNetworkId,
    () =>
      strategy.setProps({
        tokens: tokens[activeNetworkId.value].allTokens,
        tokenKeys: tokens[activeNetworkId.value].tokenKeys
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
    components,
    submit,
    error,
    pending
  };
}
