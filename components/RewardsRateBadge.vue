<template>
  <div
    v-tooltip="`Managing on ${protocolName} gives you rewards in ${tokenName}. The APY represents how much of the rewards you would earn during one year.`"
    class="flex items-center px-2 py-1 border rounded-[4px] select-none border-grey-dark border-opacity-[0.15]"
  >
    <IconCurrency :currency="currency" no-height class="w-3 h-3 mr-1" />
    <div class="text-sm font-semibold">{{ computedRate }}</div>
  </div>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useBigNumber } from '~/composables/useBigNumber'
import { useFormatting } from '~/composables/useFormatting'

export default defineComponent({
  props: {
    currency: {
      type: String,
      default: '0',
    },
    rate: {
      type: String,
      default: '0',
    },
    protocolName: {
      type: String,
      default: '',
    },
    tokenName: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { formatPercent } = useFormatting()
    const { lt } = useBigNumber()

    const computedRate = computed(() => {
      if (lt(props.rate, '0.0001')) {
        return '< 0.01%'
      }
      return formatPercent(props.rate)
    })

    return { formatPercent, computedRate }
  },
})
</script>

<style></style>
