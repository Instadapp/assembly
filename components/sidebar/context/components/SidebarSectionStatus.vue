<template>
  <div class="flex flex-col flex-shrink-0">
    <div class="flex items-center justify-between mb-4">
      <div class="text-grey-pure text-14">Status (max. {{ formatPercent(liquidation) }})</div>

      <Badge class="w-18" :color="color">{{ text }}</Badge>
    </div>

    <div class="flex items-center">
      <div class="w-24 mr-3 font-medium text-19">{{ formatPercent(status) }}</div>
      <ProgressBar class="w-full" :color="color" :progress="status" />
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useBigNumber } from '~/composables/useBigNumber'
import { useFormatting } from '~/composables/useFormatting'
import { useStatus } from '~/composables/useStatus'

export default defineComponent({
  props: {
    liquidation: { type: String, required: true },
    status: { type: String, required: true },
  },
  setup(props) {
    const { formatPercent } = useFormatting()
    const { div } = useBigNumber()

    const statusLiquidationRatio = computed(() => div(props.status, props.liquidation).toFixed())

    const { color, text } = useStatus(statusLiquidationRatio)

    return { formatPercent, color, text }
  },
})
</script>
