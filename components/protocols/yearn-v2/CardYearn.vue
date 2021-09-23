<template>
  <div
    class="flex-shrink-0 bg-white rounded-lg relative flex flex-col flex-1 px-6 pt-4 pb-6 dark:bg-dark-500"
    style="box-shadow: -1px -3px 10px rgba(12, 25, 91, 0.03), 2px 4px 12px rgba(12, 25, 91, 0.05)"
  >
    <div class="flex items-center h-14">
      <div class="flex mr-4 -space-x-3 overflow-hidden">
        <IconCurrency :currency="tokenKey" class="w-12 h-12" no-height />
      </div>

      <div class="flex flex-col flex-grow">
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

      <div class="ml-auto text-right">
        <p class="text-lg font-medium">{{ formatPercent(netAPY) }}</p> 
        <p class="text-sm font-medium text-[#9FB0C9]">net APY</p>
      </div>
    </div>

    <hr class="mt-4" />

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
  </div>
</template>

<script>
import { computed, defineComponent, useContext } from "@nuxtjs/composition-api";
import { useFormatting } from "~/composables/useFormatting";
import { useToken } from "~/composables/useToken";

export default defineComponent({
  props: {
    tokenKey: { type: String, required: true },
    vault: { type: String, default: null },
    supply: { type: String, required: true },
    supplyUsd: { type: String, required: true },
    priceInUsd: { type: String, default: "0" },
    netAPY: { type: String, default: "0" }
  },

  setup(props) {
    const { app } = useContext();
    const { formatPercent, formatUsd, formatDecimal } = useFormatting();
    const { getTokenByKey } = useToken();

    const symbol = computed(
      () => getTokenByKey(props.tokenKey)?.symbol || props.tokenKey
    );

    function showSupply() {
      app.router.push({ hash: `supply?vault=${props.vault}` });
    }

    function showWithdraw() {
      app.router.push({ hash: `withdraw?vault=${props.vault}` });
    }

    return {
      showSupply,
      showWithdraw,
      formatPercent,
      formatUsd,
      formatDecimal,
      symbol
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
