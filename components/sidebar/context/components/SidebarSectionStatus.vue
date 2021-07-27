<template>
  <div class="flex flex-col flex-shrink-0">
    <div class="flex items-center justify-between mb-6">
      <div class="font-semibold text-grey-pure text-xs">Status (max. {{ formatPercent(liquidation) }})</div>

      <Badge class="w-[80px]" :color="color">{{ text }}</Badge>
    </div>

    <div class="flex items-center">
      <div class="w-24 mr-3 font-medium text-lg">{{ formatPercent(status) }}</div>
      <progress-bar class="w-full" :color="color" :progress="status" />
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import ProgressBar from '~/components/common/ProgressBar.vue'
import { useBigNumber } from '~/composables/useBigNumber'
import { useFormatting } from '~/composables/useFormatting'
import { useStatus } from '~/composables/useStatus'

export default defineComponent({
  components: { ProgressBar },
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
