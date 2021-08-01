<template>
  <div class="flex items-center px-4 py-4 select-none dark:bg-dark-400">
    <IconCurrency :currency="tokenKey" />
    <div class="flex flex-col px-4">
      <div class="mb-1 font-semibold whitespace-no-wrap text-12 text-navi-pure dark:text-light">
        {{ formatDecimal(balance) }} {{ symbol }}
      </div>
      <div class="font-medium whitespace-no-wrap text-12 text-grey-pure">{{ formatUsd(netWorth, 2) }}</div>
    </div>
    <Button class="ml-auto w-18" color="ocean-blue" @click="$emit('action')">{{ actionLabel }}</Button>
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
