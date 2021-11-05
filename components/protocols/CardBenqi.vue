<template>
  <div
    class="flex-shrink-0 bg-white rounded-lg relative flex flex-col flex-1 px-4 pt-4 pb-6 dark:bg-dark-500"
    style="box-shadow: -1px -3px 10px rgba(12, 25, 91, 0.03), 2px 4px 12px rgba(12, 25, 91, 0.05)"
  >
    <div class="flex items-center">
      <div class="flex mr-4 -space-x-3 overflow-hidden">
        <IconCurrency :currency="tokenKey" class="w-12 h-12" no-height />
      </div>

      <div
        v-if="type === 'supply' || type === 'no'"
        class="flex flex-col flex-grow"
      >
        <div class="mb-1 font-medium leading-none whitespace-no-wrap text-19">
          {{ formatUsd(supplyUsd) }}
        </div>
        <div class="flex max-w-full leading-none">
          <span class="text-grey-pure text-14"
            >{{ formatDecimal(supply) }} {{ symbol }}</span
          >
          <Info
            :text="`${formatUsd(priceInUsd, 2)}/${symbol}`"
            icon="price"
            class="ml-1"
          />
        </div>
      </div>

      <div v-if="type === 'borrow'" class="flex flex-col flex-grow">
        <div class="mb-1 font-medium leading-none whitespace-no-wrap text-19">
          {{ formatUsd(borrowUsd) }}
        </div>
        <div class="flex leading-none whitespace-no-wrap">
          <span class="text-grey-pure text-14"
            >{{ formatDecimal(borrow) }} {{ symbol }}</span
          >
          <Info
            :text="`${formatUsd(priceInUsd, 2)}/${symbol}`"
            icon="price"
            class="ml-1"
          />
        </div>
      </div>

      <div class="flex flex-col self-start space-y-1">
        <Badge v-if="type === 'no'" color="grey">No Position</Badge>
        <Badge v-if="type === 'supply'" color="green">Supplied</Badge>
        <Badge v-if="type === 'borrow'" color="yellow">Borrowed</Badge>
        <Badge
          v-tooltip="
            'Collateral Factor is the power to borrow against a particular token. Eg:- if collateral factor of ETH is 0.75 that means for every $100 of ETH you can borrow $75 worth of other assets.'
          "
          color="blue"
          >C.F: {{ cf }}</Badge
        >
      </div>
    </div>

    <hr class="mt-4" />

    <div class="flex items-center justify-around mt-4">
      <div class="flex-col flex-1 text-center">
        <div class="flex items-center mb-1 justify-evenly">
          <div
            class="font-medium leading-none text-navi-pure-light dark:text-light text-16"
          >
            {{ formatPercent(supplyRate) }}
          </div>
          <RewardsRateBadge
            v-if="rewardsSupported"
            protocol-name="Benqi"
            token-name="COMP"
            currency="comp"
            :rate="supplyRewardRate"
          />
        </div>
        <div class="leading-none whitespace-no-wrap text-grey-pure">Supply</div>
      </div>
      <Divider vertical class="h-6" />
      <div class="flex-col flex-1 text-center">
        <div class="flex items-center mb-1 justify-evenly">
          <div
            class="font-medium leading-none text-navi-pure-light dark:text-light text-16"
          >
            {{ formatPercent(borrowRate) }}
          </div>
          <RewardsRateBadge
            v-if="rewardsSupported"
            protocol-name="Benqi"
            token-name="COMP"
            currency="comp"
            :rate="borrowRewardRate"
          />
        </div>
        <div class="leading-none whitespace-no-wrap text-grey-pure">Borrow</div>
      </div>
    </div>

    <hr class="mt-4" />

    <div v-if="type === 'no'" class="flex items-center justify-around mt-6">
      <button
        class="mr-4 h-10 w-full bg-primary-blue-dark shadow text-white rounded-[4px] hover:bg-primary-blue-hover"
        @click="showSupply"
      >
        Supply
      </button>
      <button
        class="h-10 w-full text-primary-blue-dark shadow border border-primary-blue-dark hover:border-primary-blue-hover rounded-[4px] hover:text-primary-blue-hover"
        @click="showBorrow"
      >
        Borrow
      </button>
    </div>

    <div v-if="type === 'supply'" class="flex items-center justify-around mt-6">
      <button
        class="mr-4 h-10 w-full bg-primary-blue-dark shadow text-white rounded-[4px] hover:bg-primary-blue-hover"
        @click="showSupply"
      >
        Supply
      </button>
      <button
        class="h-10 w-full text-primary-blue-dark shadow border border-primary-blue-dark hover:border-primary-blue-hover rounded-[4px] hover:text-primary-blue-hover"
        @click="showWithdraw"
      >
        Withdraw
      </button>
    </div>

    <div v-if="type === 'borrow'" class="flex items-center justify-around mt-6">
      <button
        class="mr-4 h-10 w-full bg-primary-blue-dark shadow text-white rounded-[4px] hover:bg-primary-blue-hover"
        @click="showBorrow"
      >
        Borrow
      </button>
      <button
        class="h-10 w-full text-primary-blue-dark shadow border border-primary-blue-dark hover:border-primary-blue-hover rounded-[4px] hover:text-primary-blue-hover"
        @click="showPayback"
      >
        Payback
      </button>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import { useBigNumber } from '~/composables/useBigNumber'
import { useFormatting } from '~/composables/useFormatting'
import { useNotification } from '~/composables/useNotification'
import { useToken } from '~/composables/useToken'

export default defineComponent({
  props: {
    tokenKey: { type: String, required: true },
    tokenId: { type: String, default: null },
    supply: { type: String, required: true },
    supplyUsd: { type: String, required: true },
    borrow: { type: String, required: true },
    borrowUsd: { type: String, required: true },
    supplyRate: { type: String, required: true },
    borrowRate: { type: String, required: true },
    type: { type: String, required: true },
    cf: { type: String, required: true },
    borrowEnabled: { type: Boolean, default: true },
    supplyRewardRate: { type: String, default: '0' },
    borrowRewardRate: { type: String, default: '0' },
    priceInUsd: { type: String, default: '0' },
  },

  setup(props) {
    const { app } = useContext()
    const { formatPercent, formatUsd, formatDecimal } = useFormatting()
    const { showWarning } = useNotification()
    const { isZero } = useBigNumber()
    const { getTokenByKey } = useToken()

    const rewardsSupported = computed(() => !isZero(props.supplyRewardRate) && !isZero(props.borrowRewardRate))
    const symbol = computed(() => getTokenByKey(props.tokenKey)?.symbol || props.tokenKey)

    function showSupply() {
      app.router.push({ hash: `supply?tokenId=${props.tokenId}` })
    }

    function showBorrow() {
      if (props.borrowEnabled) {
        app.router.push({ hash: `borrow?tokenId=${props.tokenId}` })
      } else {
        showWarning('Borrow Disabled', `Borrowing ${props.tokenKey.toUpperCase()} is disabled`)
      }
    }

    function showPayback() {
      app.router.push({ hash: `payback?tokenId=${props.tokenId}` })
    }

    function showWithdraw() {
      app.router.push({ hash: `withdraw?tokenId=${props.tokenId}` })
    }

    return {
      showSupply,
      showBorrow,
      showPayback,
      showWithdraw,
      formatPercent,
      formatUsd,
      formatDecimal,
      rewardsSupported,
      symbol,
    }
  },
})
</script>
<style scoped>
.position-button {
  @apply flex-1;
  @apply h-8;
  @apply h-8;
}
</style>
