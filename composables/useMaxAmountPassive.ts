//@ts-nocheck
import { computed, ref, watch } from '@nuxtjs/composition-api'
import { useBigNumber } from './useBigNumber'

/**
 * Caps amount at maxAmount and returns isMaxAmount as true when capped.
 * Keeps amount and maxAmount in sync as long as amount is not updated with a smaller value then maxAmount.
 *
 * @param {import('@nuxtjs/composition-api').Ref<string>} amountRef
 * @param {import('@nuxtjs/composition-api').Ref<string>} amountParsedRef
 * @param {import('@nuxtjs/composition-api').Ref<string>} maxAmountRef
 */
export function useMaxAmountPassive(amountRef, amountParsedRef, maxAmountRef) {
  const { toBN, eq, gte } = useBigNumber()
  const syncAmount = ref(false)

  watch(
    [amountRef, maxAmountRef],
    ([amount, maxAmount], [oldAmount] = [null]) => {
      if (!eq(amount, oldAmount)) {
        syncAmount.value = false
      }

      if (syncAmount.value || gte(amountParsedRef.value, maxAmountRef.value)) {
        syncAmount.value = true
        amountRef.value = toBN(maxAmount).toFixed()
      }
    },
    { immediate: true }
  )

  return { isMaxAmount: computed(() => syncAmount.value) }
}
