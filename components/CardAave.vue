<template>
  <div class="flex-shrink-0 shadow bg-white relative flex flex-col flex-1 px-4 pt-4 pb-6 dark:bg-dark-500">
    <div class="flex items-center h-14">
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
        <div class="flex leading-none whitespace-no-wrap">
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
          {{ formatUsd(computedBorrowUsd) }}
        </div>
        <div class="flex leading-none whitespace-no-wrap">
          <span class="text-grey-pure text-14"
            >{{ formatDecimal(computedBorrowAmount) }} {{ symbol }}</span
          >
          <Info
            :text="`${formatUsd(priceInUsd, 2)}/${symbol}`"
            icon="price"
            class="ml-1"
          />
        </div>
      </div>

      <div
        v-if="variousRateTypes.length && type === 'borrow'"
        class="self-start"
      >
        <ToggleButtonVertical
          v-model="borrowRateType"
          :values="variousRateTypes"
        />
      </div>
    </div>

    <div class="grid w-full grid-cols-3 gap-4 mt-4">
      <Badge v-if="type === 'no'" color="grey">No Position</Badge>
      <Badge v-if="type === 'supply'" color="green">Supplied</Badge>
      <Badge v-if="type === 'borrow'" color="yellow">Borrowed</Badge>
      <Badge v-tooltip="'Collateral Factor is the power to borrow against a particular token. Eg:- if collateral factor of ETH is 0.75 that means for every $100 of ETH you can borrow $75 worth of other assets.'" color="blue">C.F: {{ cf }}</Badge>
      <Badge v-if="ll !== null" v-tooltip="'Liquidation Limit is the point where position is subject to liquidate. Eg:- if liquidation limit of ETH is 0.8 that means for every $100 of ETH if the debt crosses $80 position will get liquidate.'" color="blue"
        >L.L: {{ ll }}</Badge
      >
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
            v-if="supplyRewardsSupported"
            protocol-name="Aave Market"
            :token-name="rewardTokenName"
            :currency="rewardCurrency"
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
            {{ formatPercent(computedBorrowRate) }}
          </div>
          <RewardsRateBadge
            v-if="borrowRewardsSupported"
            protocol-name="Aave Market"
            :token-name="rewardTokenName"
            :currency="rewardCurrency"
            :rate="borrowRewardRate"
          />
        </div>
        <div class="leading-none whitespace-no-wrap text-grey-pure">Borrow</div>
      </div>
    </div>

    <hr class="mt-4" />

    <div
      v-if="type === 'no'"
      class="flex items-center justify-around px-4 mt-6"
    >
      <Button
        class="mr-4 position-button"
        color="ocean-blue"
        @click="showSupply"
        >Supply</Button
      >
      <Button class="position-button" color="ocean-blue" @click="showBorrow"
        >Borrow</Button
      >
    </div>

    <div
      v-if="type === 'supply'"
      class="flex items-center justify-around px-4 mt-6"
    >
      <Button
        class="mr-4 position-button"
        color="ocean-blue"
        @click="showSupply"
        >Supply</Button
      >
      <Button class="position-button" color="ocean-blue" @click="showWithdraw"
        >Withdraw</Button
      >
    </div>

    <div
      v-if="type === 'borrow'"
      class="flex items-center justify-around px-4 mt-6"
    >
      <Button
        class="mr-4 position-button"
        color="ocean-blue"
        @click="showBorrow"
        >Borrow</Button
      >
      <Button class="position-button" color="ocean-blue" @click="showPayback"
        >Payback</Button
      >
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, useContext, watch } from '@nuxtjs/composition-api'
import { useBigNumber } from '~/composables/useBigNumber'
import { useFormatting } from '~/composables/useFormatting'
import { useToken } from '~/composables/useToken'

export default defineComponent({
  props: {
    tokenKey: { type: String, required: true },
    tokenId: { type: String, default: null },
    supply: { type: String, required: true },
    supplyUsd: { type: String, required: true },
    borrow: { type: String, required: true },
    borrowStable: { type: String, default: '0' },
    borrowUsd: { type: String, required: true },
    borrowStableUsd: { type: String, default: '0' },
    supplyRate: { type: String, required: true },
    borrowRate: { type: String, required: true },
    borrowStableRate: { type: String, default: '0' },
    supplyRewardRate: { type: String, default: '0' },
    borrowRewardRate: { type: String, default: '0' },
    type: { type: String, required: true },
    cf: { type: String, required: true },
    ll: { type: String, default: null },
    borrowEnabled: { type: Boolean, default: true },
    variousRateTypes: { type: Array, default: () => [] },
    rewardTokenName: { type: String, default: '0' },
    rewardCurrency: { type: String, default: '0' },
    priceInUsd: { type: String, default: '0' },
  },

  setup(props) {
    const { app } = useContext()
    const { formatPercent, formatUsd, formatDecimal } = useFormatting()
    const { isZero } = useBigNumber()
    const { getTokenByKey } = useToken()

    const borrowRateType = ref({})
    const supplyRewardsSupported = computed(() => !isZero(props.supplyRewardRate))
    const borrowRewardsSupported = computed(() => !isZero(props.borrowRewardRate))
    const symbol = computed(() => getTokenByKey(props.tokenKey)?.symbol || props.tokenKey)

    watch(
      [() => props.borrow, () => props.borrowStable],
      ([updBorrow, updBorrowStable]) => {
        if (Array.isArray(props.variousRateTypes)) {
          borrowRateType.value = isZero(props.borrowStable) ? props.variousRateTypes[0] : props.variousRateTypes[1]
        }
      },
      { immediate: true }
    )

    const computedBorrowUsd = computed(() => {
      if (borrowRateType.value?.value === 'stable') {
        return props.borrowStableUsd
      }
      return props.borrowUsd
    })

    const computedBorrowRate = computed(() => {
      if (borrowRateType.value?.value === 'stable') {
        return props.borrowStableRate
      }
      return props.borrowRate
    })

    const computedBorrowAmount = computed(() => {
      if (borrowRateType.value?.value === 'stable') {
        return props.borrowStable
      }
      return props.borrow
    })

    function showSupply() {
      if (props.tokenId) {
        app.router.push({ hash: `supply?tokenId=${props.tokenId}` })
      } else {
        app.router.push({ hash: `supply?tokenKey=${props.tokenKey}` })
      }
    }

    function showBorrow() {
      if (props.borrowEnabled) {
        if (props.tokenId) {
          app.router.push({ hash: `borrow?tokenId=${props.tokenId}` })
        } else {
          app.router.push({ hash: `borrow?tokenKey=${props.tokenKey}` })
        }
      } else {
        // showWarning('Borrow Disabled', `Borrowing ${props.tokenKey.toUpperCase()} is disabled`)
      }
    }

    function showPayback() {
      if (props.tokenId) {
        app.router.push({ hash: `payback?tokenId=${props.tokenId}` })
      } else {
        app.router.push({ hash: `payback?tokenKey=${props.tokenKey}` })
      }
    }

    function showWithdraw() {
      if (props.tokenId) {
        app.router.push({ hash: `withdraw?tokenId=${props.tokenId}` })
      } else {
        app.router.push({ hash: `withdraw?tokenKey=${props.tokenKey}` })
      }
    }

    return {
      showSupply,
      showBorrow,
      showPayback,
      showWithdraw,
      formatPercent,
      formatUsd,
      formatDecimal,
      borrowRateType,
      computedBorrowRate,
      computedBorrowAmount,
      computedBorrowUsd,
      supplyRewardsSupported,
      borrowRewardsSupported,
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
