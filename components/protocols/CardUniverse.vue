<template>
  <div
    class="flex-shrink-0 bg-white rounded-lg relative flex flex-col flex-1 px-6 pt-4 pb-6 dark:bg-dark-500"
    style="box-shadow: -1px -3px 10px rgba(12, 25, 91, 0.03), 2px 4px 12px rgba(12, 25, 91, 0.05)"
  >
    <div class="flex items-center h-14 mb-1">
      <span class="text-lg font-bold">{{ vaultName }}</span>
    </div>
    <div class="flex items-center h-14">
      <div class="flex mr-4 -space-x-3 overflow-hidden">
        <div
          v-if="tokenIcon"
          class="inline-flex items-center justify-center dark:opacity-90 w-12 h-12"
        >
          <img class="w-full h-full object-cover" :src="tokenIcon" />
        </div>
        <IconCurrency v-else :currency="tokenKey" class="w-12 h-12" no-height />
      </div>

      <div class="flex flex-col flex-grow">
        <div class="font-medium text-lg leading-8 whitespace-no-wrap">
          {{ formatUsd(supplyUsd) }}
        </div>
        <div class="flex h-4 whitespace-no-wrap">
          <span class="text-sm font-medium text-[#9FB0C9]">{{ formatDecimal(supply) }} {{ symbol }}</span>
          
          <Info
            :text="`${formatUsd(priceInUsd, 2)}/${symbol}`"
            icon="price"
            class="ml-1"
          />
        </div>
      </div>
      <div class="text-right mr-4 hidden md:block">
        <p class="leading-8  ">
        <span class="text-lg font-medium">{{ untReward }}</span>
        <span class="text-base font-medium">UNT / $10K / Day</span>
        </p>
        <div class="h-4 flex justify-end">
          <p class="text-sm font-medium text-[#9FB0C9]">Rewards</p>
          <Info class="ml-1 h-3" text="Estimated Rewards" />
        </div>
      </div>
      <div class="ml-auto text-right">
        <p class="leading-8	 text-lg font-bold text-green-500">{{ formatPercent(feeAprLifetime, 2, true) }}</p>
        <div class="h-4 flex">
          <p class="text-sm font-medium text-[#9FB0C9]">Fee APR</p>
          <Info class="ml-1 h-3" text="Trading fees earned in Uniswap V3 pool" />
        </div>
      </div>
      <!--
      <div class="ml-auto text-right">
        <p class="text-lg font-medium">{{ formatPercent(netAPY) }}</p>
        <p class="text-sm font-medium text-[#9FB0C9]">Net APR</p>
      </div>
      -->
    </div>
    <hr class="mt-4" />
    <!--
    <div class="flex items-center justify-around">
      <div class="text-center mr-5">
        <p class="text-sm font-medium">
        {{ 0 }} UNT / $10K / Day
        </p>
        <p class="text-xs font-medium text-[#9FB0C9]">Rewards</p>
      </div>
    </div>
     <hr class="mt-4" />
    -->
    <div class="flex items-center justify-around mt-6">
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
    <div class="flex items-center justify-around mt-3">
      <!--
      <a :href="detailLink" target="_blank" class="text-primary text-sm hover:text-primary-blue-hover">View Performance</a>
      -->
      <button
        class="h-10 text-sm  whitespace-no-wrap transition-colors duration-75 ease-out select-none disabled:opacity-50 focus:outline-none rounded-[4px] position-button bg-ocean-blue-pure bg-opacity-10 dark:text-ocean-blue-pale dark:bg-opacity-17 hover:bg-opacity-25 focus:bg-opacity-25 active:bg-opacity-38 dark:active:bg-opacity-38 dark:hover:bg-opacity-25 dark:focus:bg-opacity-25 text-ocean-blue-pure"
        @click="gotoUniverse"
      >
        View Performance
      </button>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, useContext } from "@nuxtjs/composition-api";
import { useFormatting } from "~/composables/useFormatting";
import { useToken } from "~/composables/useToken";

export default defineComponent({
  props: {
    vaultName: { type: String, required: true },
    tokenKey: { type: String, required: true },
    tokenIcon: { type: String, required: false },
    vault: { type: String, default: null },
    tokenIndex: { type: Number, default: 0 },
    supply: { type: String, required: true },
    untReward: { type: Number, default: 0 },
    supplyUsd: { type: String, required: true },
    priceInUsd: { type: String, default: "0" },
    feeAprLifetime: { type: String, default: "0" },
    link: { type: String, default: "" }
  },

  setup(props) {
    const { app } = useContext();
    const { formatPercent, formatUsd, formatDecimal } = useFormatting();
    const { getTokenByKey } = useToken();

    const symbol = computed(
      () => getTokenByKey(props.tokenKey)?.symbol || props.tokenKey
    );

    function showSupply() {
      app.router.push({ hash: `supply?vault=${props.vault}&tokenIndex=${props.tokenIndex}` });
    }

    function showWithdraw() {
      app.router.push({ hash: `withdraw?vault=${props.vault}&tokenIndex=${props.tokenIndex}` });
    }

    function gotoUniverse() {
      window.open(props.link)
    }

    return {
      showSupply,
      showWithdraw,
      gotoUniverse,
      formatPercent,
      formatUsd,
      formatDecimal,
      symbol,
    };
  }
});
</script>
<style scoped>
.position-button {
  @apply flex-1;
  @apply h-8;
  @apply h-8;
}
</style>
