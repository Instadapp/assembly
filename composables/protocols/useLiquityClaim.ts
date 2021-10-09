import { useWeb3 } from "@instadapp/vue-web3";
import { ref, computed } from "@nuxtjs/composition-api";
import { useBalances } from "../useBalances";
import { useBigNumber } from "../useBigNumber";
import { useDSA } from "../useDSA";
import { useNotification } from "../useNotification";
import { useToken } from "../useToken";
import { useLiquityPosition } from "./useLiquityPosition";

export function useLiquityClaim() {
  const { account } = useWeb3();
  const { getTokenByKey, valInt } = useToken();
  const { dsa } = useDSA();
  const { plus } = useBigNumber();
  const {
    stabilityEthGain,
    getTrovePositionHints,
    debtInWei,
    collateralInWei,
    fetchPosition
  } = useLiquityPosition();

  const {
    showConfirmedTransaction,
    showPendingTransaction,
    showWarning,
  } = useNotification();
  const { fetchBalances } = useBalances();

  const ethToken = computed(() => getTokenByKey("eth"));

  const pendingStabilityClaimAndMove = ref(false);

  async function stabilityClaimAndMove() {
    pendingStabilityClaimAndMove.value = true;

    try {
      const amountInWei = valInt(
        stabilityEthGain.value,
        ethToken.value.decimals
      );
      const totalDepositAmountInWei = plus(
        collateralInWei.value,
        amountInWei
      ).toFixed();

      const { upperHint, lowerHint } = await getTrovePositionHints(
        totalDepositAmountInWei,
        debtInWei.value
      );

      console.log({
        connector: "LIQUITY-A",
        method: "stabilityMoveEthGainToTrove",
        args: [upperHint, lowerHint]
      });
      
      const spells = dsa.value.Spell();
      spells.add({
        connector: "LIQUITY-A",
        method: "stabilityMoveEthGainToTrove",
        args: [upperHint, lowerHint]
      });

      const tx = await dsa.value.cast({
        spells,
        from: account.value,
        onReceipt: async receipt => {
          showConfirmedTransaction(receipt.transactionHash);

          await fetchBalances(true);
          await fetchPosition();
        }
      });

      showPendingTransaction(tx);
    } catch (error) {
      console.log(error);
      showWarning(error.message);
    }

    pendingStabilityClaimAndMove.value = false;
  }

  const pendingStabilityClaimOnly = ref(false);

  async function stabilityClaimOnly() {
    pendingStabilityClaimOnly.value = true;

    try {
      const supplyAmountInWei = 0;

      const getDepositId = 0;
      const setDepositId = 0;
      const setEthGainId = 0;
      const setLqtyGainId = 0;

      const spells = dsa.value.Spell();
      spells.add({
        connector: "LIQUITY-A",
        method: "stabilityWithdraw",
        args: [
          supplyAmountInWei,
          getDepositId,
          setDepositId,
          setEthGainId,
          setLqtyGainId
        ]
      });

      

      const tx = await dsa.value.cast({
        spells,
        from: account.value,
        onReceipt: async receipt => {
          showConfirmedTransaction(receipt.transactionHash);

          await fetchBalances(true);
          await fetchPosition();
        }
      });

      showPendingTransaction(tx);
    } catch (error) {
      console.log(error);
      showWarning(error.message);
    }

    pendingStabilityClaimOnly.value = false;
  }

  return {
    stabilityClaimAndMove,
    pendingStabilityClaimAndMove,
    pendingStabilityClaimOnly,
    stabilityClaimOnly
  };
}
