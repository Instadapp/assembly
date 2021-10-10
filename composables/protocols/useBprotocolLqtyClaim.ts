import { useWeb3 } from "@instadapp/vue-web3";
import { ref, computed } from "@nuxtjs/composition-api";
import { useBalances } from "../useBalances";
import { useDSA } from "../useDSA";
import { useNotification } from "../useNotification";
import { useBprotocolPosition } from "./useBprotocolPositions";

export function useBprotocolLqtyClaim() {
  const { account } = useWeb3();
  const { dsa } = useDSA();
  const {
    fetchUserData
  } = useBprotocolPosition();

  const {
    showConfirmedTransaction,
    showPendingTransaction,
    showWarning,
  } = useNotification();
  const { fetchBalances } = useBalances();

  const pendingLqtyClaim = ref(false);

  async function claimLqty() {
    debugger
    pendingLqtyClaim.value = true;

    try {

      const spells = dsa.value.Spell();
      spells.add({
        connector: 'B-LIQUITY-A',
        method: 'withdraw',
        args: [0, 0, 0, 0],
      })

      const tx = await dsa.value.cast({
        spells,
        from: account.value,
        onReceipt: async receipt => {
          showConfirmedTransaction(receipt.transactionHash);

          await fetchBalances(true);
          await fetchUserData();
        }
      });

      showPendingTransaction(tx);
    } catch (error) {
      console.log(error);
      showWarning(error.message);
    }

    pendingLqtyClaim.value = false;
  }


  return {
    claimLqty,
    pendingLqtyClaim,
  };
}
