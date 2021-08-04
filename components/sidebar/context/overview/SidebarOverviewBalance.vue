<template>
  <div class="flex flex-col items-center text-primary-black flex-shrink-0 w-full px-8 mb-2 text-center sm:mb-10">
    <h3 class="flex items-center font-medium leading-none">Balance</h3>
    <div class="mt-2 font-semibold text-32">{{ formatUsd(balanceTotal) }}</div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import SVGChevronUp from '@/assets/img/icons/chevron-up.svg'
import { useFormatting } from '~/composables/useFormatting'
import { useBalances } from '~/composables/useBalances'

export default defineComponent({
  components: {
    SVGChevronUp,
  },
  setup() {
    const { formatUsd } = useFormatting()
    const { balanceTotal, fetchBalances, balances, prices } = useBalances()

    onMounted(() => {
        fetchBalances(true)
    })

    return { formatUsd, balanceTotal, balances, prices }
  },
})
</script>
