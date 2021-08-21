<template>
  <div
    class="flex-shrink-0 bg-white rounded-lg relative flex flex-col flex-1 px-4 pt-4 pb-6 dark:bg-dark-500"
    style="box-shadow: -1px -3px 10px rgba(12, 25, 91, 0.03), 2px 4px 12px rgba(12, 25, 91, 0.05)"
  >
    <div class="flex items-center">
      <IconCurrency :currency="token.key" class="w-12 h-12" no-height />
      <div class="flex flex-col flex-grow mx-4">
        <div class="mb-1 font-medium leading-none whitespace-no-wrap text-19">
          {{ formatUsd(amountUsd) }}
        </div>
        <div class="flex leading-none whitespace-no-wrap">
          <span class="text-grey-pure text-14"
            >{{ formatDecimal(amount) }} {{ token.symbol }}</span
          >
          <Info
            :text="`${formatUsd(priceInUsd, 2)}/${token.symbol}`"
            icon="price"
            class="ml-1"
          />
        </div>
      </div>
      <div class="self-start">
        <Badge
          :color="positionType === 'supply' ? 'green' : 'yellow'"
          class="w-16"
          >{{ badge }}</Badge
        >
      </div>
    </div>

    <hr class="mt-4" />

    <div class="flex items-center justify-around px-4 mt-6">
      <button
        class="mr-4 h-10 w-full bg-primary-blue-dark shadow text-white rounded-[4px] hover:bg-primary-blue-hover"
        @click="supplyOrBorrow"
      >
        {{ buttonOne }}
      </button>
      <button
        class="h-10 w-full text-primary-blue-dark shadow border border-primary-blue-dark hover:border-primary-blue-hover rounded-[4px] hover:text-primary-blue-hover"
        @click="withdrawOrPayback"
      >
        {{ buttonTwo }}
      </button>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import { useFormatting } from '@/composables/useFormatting'
import { useBigNumber } from '~/composables/useBigNumber'

export default defineComponent({
  props: {
    collateral: { type: String, default: '0' },
    debt: { type: String, default: '0' },
    amountUsd: { type: String, default: '0' },
    positionType: { type: String, default: 'no' },
    token: { type: Object, default: () => { } },
    priceInUsd: { type: String, default: '0' },
  },

  setup(props) {
    const { app } = useContext()
    const { formatUsd, formatDecimal } = useFormatting()
    const { isZero } = useBigNumber()

    const amount = computed(() => (props.positionType === 'supply' ? props.collateral : props.debt))
    const withdrawOrPaybackDisabled = computed(() => isZero(amount.value))

    const buttonOne = computed(() => (props.positionType === 'supply' ? 'Supply' : 'Borrow'))
    const buttonTwo = computed(() => (props.positionType === 'supply' ? 'Withdraw' : 'Payback'))
    const badge = computed(() => (props.positionType === 'supply' ? 'Collateral' : 'Debt'))

    function showSupply() {
      app.router.push({ hash: 'trove-supply' })
    }

    function showBorrow() {
      if (isZero(props.collateral)) return

      app.router.push({ hash: 'trove-borrow' })
    }

    function showPayback() {
      if (isZero(amount.value)) return

      app.router.push({ hash: 'trove-payback' })
    }

    function showWithdraw() {
      if (isZero(amount.value)) return

      app.router.push({ hash: 'trove-withdraw' })
    }

    function supplyOrBorrow() {
      props.positionType === 'supply' ? showSupply() : showBorrow()
    }
    function withdrawOrPayback() {
      props.positionType === 'supply' ? showWithdraw() : showPayback()
    }

    return {
      formatUsd,
      formatDecimal,
      buttonOne,
      buttonTwo,
      badge,
      supplyOrBorrow,
      withdrawOrPayback,
      withdrawOrPaybackDisabled,
      amount,
    }
  },
})
</script>
