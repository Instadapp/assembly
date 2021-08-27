<template>
  <div
    class="flex-shrink-0 bg-white rounded-lg relative flex flex-col flex-1 px-4 pt-4 pb-6 dark:bg-dark-500"
    style="box-shadow: -1px -3px 10px rgba(12, 25, 91, 0.03), 2px 4px 12px rgba(12, 25, 91, 0.05)"
  >
    <div class="flex items-center">
      <IconCurrency :currency="tokenKey" class="w-12 h-12" no-height />
      <div class="flex flex-col flex-grow mx-4">
        <div class="mb-1 font-medium leading-none whitespace-no-wrap text-19">{{ formatUsd(amountUsd) }}</div>
        <div class="flex leading-none whitespace-no-wrap">
          <span class="text-grey-pure text-14">{{ formatDecimal(amount) }} {{ symbol }}</span>
          <Info :text="`${formatUsd(priceInUsd, 2)}/${symbol}`" icon="price" class="ml-1" />
        </div>
      </div>
      <div class="self-start">
        <Badge :color="positionType === 'supply' ? 'green' : 'yellow'" class="w-16">{{ badge }}</Badge>
      </div>
    </div>

    <hr class="mt-4" />

    <div class="flex items-center justify-around px-4 mt-6">
      <button class="mr-4 h-10 w-full bg-primary-blue-dark shadow text-white rounded-[4px] hover:bg-primary-blue-hover"  @click="supplyOrBorrow">{{ buttonOne }}</button>
      <button class="h-10 w-full text-primary-blue-dark shadow border border-primary-blue-dark hover:border-primary-blue-hover rounded-[4px] hover:text-primary-blue-hover" color="ocean-blue" @click="withdrawOrPayback">{{ buttonTwo }}</button>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useFormatting } from '@/composables/useFormatting'
import { useToken } from '~/composables/useToken'

export default defineComponent({
  props: {
    amount: { type: String, default: '0' },
    amountUsd: { type: String, default: '0' },
    positionType: { type: String, default: 'supply' },
    tokenKey: { type: String, required: true },
    safeTokenType: { type: String, default: 'token' },
    supplyOrBorrow: { type: Function, required: true },
    withdrawOrPayback: { type: Function, required: true },
    priceInUsd: { type: String, default: '0' },
  },

  setup(props) {
    const { formatUsd, formatDecimal } = useFormatting()
    const { getTokenByKey } = useToken()

    const symbol = computed(() => getTokenByKey(props.tokenKey)?.symbol || props.tokenKey)

    const buttonOne = computed(() => (props.positionType === 'supply' ? 'Supply' : 'Borrow'))
    const buttonTwo = computed(() => (props.positionType === 'supply' ? 'Withdraw' : 'Payback'))
    const badge = computed(() => (props.positionType === 'supply' ? 'Collateral' : 'Debt'))

    return {
      formatUsd,
      formatDecimal,
      buttonOne,
      buttonTwo,
      badge,
      symbol,
    }
  },
})
</script>