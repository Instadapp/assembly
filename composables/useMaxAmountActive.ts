import { computed, ref, watch } from "@nuxtjs/composition-api";
import { useBigNumber } from "./useBigNumber";

/**
 * Saves and restores a previous amount value when setting the isMaxAmount toggle.
 *
 * @param {import('@nuxtjs/composition-api').Ref<string>} amountRef Reference for amount.
 * @param {import('@nuxtjs/composition-api').Ref<string>} maxAmountRef Reference for maxAmount.
 */
export function useMaxAmountActive(amountRef, maxAmountRef) {
  const { toBN, eq } = useBigNumber();

  let prevAmount = toBN(amountRef.value).toFixed();

  const syncAmount = ref(false);

  watch(
    [amountRef, syncAmount],
    ([amount, syncAmountValue], [oldAmount, oldSyncAmountValue]) => {
      //@ts-ignore
      if (!eq(amount, oldAmount) && syncAmountValue === oldSyncAmountValue) {
        // If amount has changed turn of syncing
        syncAmount.value = false;
      }
    }
  );

  watch([maxAmountRef, syncAmount], ([maxAmount, syncAmountValue]) => {
    if (syncAmountValue) {
      // Update amount if syncing is enabled
      //@ts-ignore
      amountRef.value = toBN(maxAmount).toFixed();
    }
  });

  function setSyncAmount(syncAmountValue) {
    if (syncAmount.value === syncAmountValue) return;

    if (syncAmountValue) {
      // Store amount value when syncing
      syncAmount.value = true;
      prevAmount = toBN(amountRef.value).toFixed();
      amountRef.value = toBN(maxAmountRef.value).toFixed();
    } else {
      // Restore amount value when syncing is disabled
      amountRef.value = prevAmount;
      syncAmount.value = false;
    }
  }

  function enable() {
    setSyncAmount(true);
  }

  function disable() {
    setSyncAmount(false);
  }

  function toggle() {
    setSyncAmount(!syncAmount.value);
  }

  return {
    enable,
    disable,
    toggle,
    isMaxAmount: computed(() => syncAmount.value)
  };
}
