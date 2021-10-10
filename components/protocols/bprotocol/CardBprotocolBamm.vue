<template>
  <div
    class="flex-shrink-0 bg-white rounded-lg relative flex flex-col flex-1 px-4 pt-4 pb-6 dark:bg-dark-500"
    style="box-shadow: -1px -3px 10px rgba(12, 25, 91, 0.03), 2px 4px 12px rgba(12, 25, 91, 0.05)"
  >
    <div class="flex items-center">
      <IconCurrency :currency="token.key" class="w-12 h-12" no-height />
      <div class="flex flex-col flex-grow mx-4">
        <div class="mb-1 font-medium leading-none whitespace-no-wrap text-19">
          {{ formatUsd(amountUsd, 2) }}
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

    <div class="flex w-full px-4 mt-4">
      <ButtonOutlined
        class="flex-1"
        :loading="pendingLqtyClaim"
        :disabled="false"
        @click="claimLqty"
        >Claim LQTY
      </ButtonOutlined>
    </div>

    <hr class="my-4" />

    <div v-if="ethIsGreaterThanOnePromille" class="flex items-center w-full px-4 mb-2">
      <div class="flex items-start justify-between w-full">
        <div
          class="flex font-medium leading-none whitespace-no-wrap text-14"
        >
          <span>Your Deposit</span>
        </div>
        <div>
          <div class="flex items-center font-medium leading-none text-14 ">
            <div class="flex items-center mr-1">
              <IconCurrency currency="lusd" no-height class="w-5 h-5" />
            </div>
            <div class="mr-1">{{ formatDecimal(lusdUserBalance) }}</div>
            <div>LUSD</div>
          </div>

          <div class="flex items-center font-medium leading-none text-14 mt-2">
            <div class="flex items-center mr-1">
              <IconCurrency currency="eth" no-height class="w-5 h-5" />
            </div>
            <div class="mr-1">{{ formatDecimal(ethUserBalance) }}</div>
            <div>ETH</div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-around px-4 mt-6">
      <button
        class="mr-4 h-10 w-full bg-primary-blue-dark shadow text-white rounded-[4px] hover:bg-primary-blue-hover"
        @click="$router.push({ hash: 'deposit'})"
      >
        Supply
      </button>
      <button
        class="h-10 w-full text-primary-blue-dark shadow border border-primary-blue-dark hover:border-primary-blue-hover rounded-[4px] hover:text-primary-blue-hover"
        :disabled="!supplyNotZero"
        @click="$router.push({ hash: 'withdraw'})"
      >
        Withdraw
      </button>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import { useFormatting } from '@/composables/useFormatting'
import { useBprotocolLqtyClaim } from '@/composables/protocols/useBprotocolLqtyClaim'
import { useBigNumber } from '~/composables/useBigNumber'
import ButtonOutlined from '~/components/common/input/ButtonOutlined.vue'

export default defineComponent({
  components: { ButtonOutlined },
  props: {
    amount: { type: String, default: '0' },
    amountUsd: { type: String, default: '0' },
    token: { type: Object, default: () => { } },
    priceInUsd: { type: String, default: '0' },
    ethUserBalance: { type: String, default: '0' },
    stabilityLqtyGain: { type: String, default: '0' },
    lusdUserBalance: { type: String, default: '0' },
    ethIsGreaterThanOnePromille: { type: Boolean, default: false }
  },

  setup(props) {
    const { app } = useContext()
    const { formatUsd, formatDecimal } = useFormatting()
    const { isZero } = useBigNumber()

    const { claimLqty, pendingLqtyClaim } = useBprotocolLqtyClaim()

    const claimLqtyDisabled = computed(() => isZero(props.amount) || pendingLqtyClaim.value)

    const supplyNotZero = computed(() => !isZero(props.amount))

    const badge = computed(() => (supplyNotZero.value ? 'Supplied' : 'No position'))

    return {
      formatUsd,
      formatDecimal,
      badge,
      supplyNotZero,
      pendingLqtyClaim,
      claimLqty: () => claimLqtyDisabled.value ? null : claimLqty()
    }
  },
})
</script>
