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
        <Badge :color="supplyNotZero ? 'green' : 'grey'" class="w-20">{{
          badge
        }}</Badge>
      </div>
    </div>

    <hr class="my-4" />

    <div class="flex items-center w-full px-4 mb-2">
      <div class="flex items-center justify-between w-full">
        <div
          class="flex items-center font-medium leading-none whitespace-no-wrap text-14"
        >
          <span>Rewards</span>
        </div>
        <div class="flex items-center font-medium leading-none text-14">
          <div class="flex items-center mr-1">
            <IconCurrency currency="lqty" no-height class="w-5 h-5" />
          </div>
          <div class="mr-1">{{ formatDecimal(stabilityLqtyGain) }}</div>
          <div>LQTY</div>
        </div>
      </div>
    </div>

    <div class="flex items-center w-full px-4">
      <div class="flex items-center justify-between w-full">
        <div
          class="flex items-center font-medium leading-none whitespace-no-wrap text-14"
        >
          <span>Liquidation gain </span>
        </div>
        <div class="flex items-center font-medium leading-none text-14">
          <div class="flex items-center mr-1">
            <IconCurrency currency="eth" no-height class="w-5 h-5" />
          </div>
          <div class="mr-1">{{ formatDecimal(stabilityEthGain) }}</div>
          <div>ETH</div>
        </div>
      </div>
    </div>

    <div class="flex w-full px-4 mt-4">
      <ButtonOutlined
        class="flex-1"
        :loading="pendingStabilityClaimOnly"
        :disabled="claimOnlyDisabled"
        @click="stabilityClaimOnly"
        >Claim LQTY and ETH
      </ButtonOutlined>
    </div>
    <div class="flex w-full px-4 mt-2">
      <ButtonOutlined
        class="flex-1"
        :loading="pendingStabilityClaimAndMove"
        :disabled="claimAndMoveDisabled"
        @click="stabilityClaimAndMove"
        >Claim LQTY and move ETH to Trove</ButtonOutlined
      >
    </div>

    <hr class="mt-4" />

    <div class="flex items-center justify-around px-4 mt-6">
      <button
        class="mr-4 h-10 w-full bg-primary-blue-dark shadow text-white rounded-[4px] hover:bg-primary-blue-hover"
        @click="showSupply"
      >
        Supply
      </button>
      <button
        class="h-10 w-full text-primary-blue-dark shadow border border-primary-blue-dark hover:border-primary-blue-hover rounded-[4px] hover:text-primary-blue-hover"
        :disabled="!supplyNotZero"
        @click="showWithdraw"
      >
        Withdraw
      </button>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import { useFormatting } from '@/composables/useFormatting'
import { useLiquityClaim } from '@/composables/protocols/useLiquityClaim'
import { useBigNumber } from '~/composables/useBigNumber'
import ButtonOutlined from '~/components/common/input/ButtonOutlined.vue'

export default defineComponent({
  components: { ButtonOutlined },
  props: {
    amount: { type: String, default: '0' },
    amountUsd: { type: String, default: '0' },
    token: { type: Object, default: () => { } },
    priceInUsd: { type: String, default: '0' },
    stabilityEthGain: { type: String, default: '0' },
    stabilityLqtyGain: { type: String, default: '0' },
  },

  setup(props) {
    const { app } = useContext()
    const { formatUsd, formatDecimal } = useFormatting()
    const { isZero } = useBigNumber()

    const { stabilityClaimAndMove, pendingStabilityClaimAndMove, pendingStabilityClaimOnly, stabilityClaimOnly } =
      useLiquityClaim()

    const claimAndMoveDisabled = computed(() => isZero(props.amount) || pendingStabilityClaimOnly.value)
    const claimOnlyDisabled = computed(() => isZero(props.amount) || pendingStabilityClaimAndMove.value)

    const supplyNotZero = computed(() => !isZero(props.amount))

    const badge = computed(() => (supplyNotZero.value ? 'Supplied' : 'No position'))

    function showSupply() {
      app.router.push({ hash: 'pool-supply' })
    }

    function showWithdraw() {
      if (!supplyNotZero.value) return

      app.router.push({ hash: 'pool-withdraw' })
    }

    return {
      formatUsd,
      formatDecimal,
      badge,
      showSupply,
      showWithdraw,
      supplyNotZero,
      stabilityClaimAndMove,
      pendingStabilityClaimAndMove,
      claimAndMoveDisabled,
      pendingStabilityClaimOnly,
      claimOnlyDisabled,
      stabilityClaimOnly,
    }
  },
})
</script>
