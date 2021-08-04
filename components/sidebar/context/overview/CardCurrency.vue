<template>
  <div
    class="flex items-center px-4 py-4 select-none shadow-sm bg-white rounded-[4px] "
  >
    <IconCurrency :currency="tokenKey" />
    <div class="flex-1 flex flex-col px-4">
      <div
        class="mb-1 font-semibold whitespace-no-wrap text-sm text-primary-dark"
      >
        {{ formatDecimal(balance) }} {{ symbol }}
      </div>
      <div
        class="font-medium whitespace-no-wrap text-sm text-[#9299AF] text-opacity-90"
      >
        {{ formatUsd(netWorth, 2) }}
      </div>
    </div>
    <div class="flex flex-col items-center">
      <button
        class="mb-2 h-[26px] w-24 flex-shrink-0 text-xs bg-primary-blue-dark shadow text-white rounded-[4px] hover:bg-primary-blue-hover"
         @click="$emit('deposit')"
      >
        Deposit
      </button>
      <button
        class="h-[26px] w-24 text-xs flex-shrink-0  text-primary-blue-dark shadow border border-primary-blue-dark border-opacity-38 hover:border-primary-blue-hover rounded-[4px] hover:text-primary-blue-hover"
        @click="$emit('action')"
      >
        Withdraw
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useFormatting } from '~/composables/useFormatting'

export default defineComponent({
  props: {
    tokenKey: { type: String, required: true },
    symbol: { type: String, required: true },
    balance: { type: String, required: true },
    netWorth: { type: String, required: true },
    actionLabel: { type: String, required: true },
  },
  setup() {
    const { formatUsd, formatDecimal } = useFormatting()
    return { formatUsd, formatDecimal }
  },
})
</script>
