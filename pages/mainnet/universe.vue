<template>
  <div>
    <div>
      <nuxt-link
        to="/"
        class="text-[#C0C5D7] text-lg font-semibold flex items-center"
      >
        <BackIcon class="w-4 h-4 mr-3" />
        Apps
      </nuxt-link>
    </div>

    <div class="mt-10 flex items-center justify-between">
      <div class="flex items-center">
        <div
          style="background: radial-gradient(42.15% 42.15% at 48.94% 48.94%, #D6DAE0 75.67%, #F0F3F9 100%), #C4C4C4;"
          class="w-16 h-16 rounded-full flex items-center justify-center border border-[#CCDCF3]"
        >
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center bg-[#1874FF]"
          >
            <UniverseIcon class="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 class="ml-4 text-primary-black text-2xl font-semibold">Universe Finance</h1>
      </div>
    </div>

    <div class="mt-10">
      <h2 class="text-primary-gray text-lg font-semibold">Overview</h2>

      <div
        class="px-1 mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 xl:gap-[18px]"
      >
        <div class="shadow rounded-lg py-5 px-5 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              {{ formatUsd(overview.tvl) }}
            </h3>
            <p class="mt-2 text-primary-gray font-medium">Total Value Locked</p>
          </div>
        </div>

        <div class="shadow rounded-lg py-5 px-5 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              {{ formatUsd(overview.totalProfits) }}
            </h3>
            <div class="flex mt-2">
              <p class="text-primary-gray font-medium">Total Fees Earned</p>
              <Info class="ml-1 mt-1" text="Trading fees earned in Uniswap V3 pool, including all pools of universe.finance" />
            </div>
          </div>
        </div>
        
        <div class="shadow rounded-lg py-5 px-5 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              {{ formatNumber(overview.totalGasSaved) }} ETH
            </h3>
            <div class="flex mt-2">
              <p class="text-primary-gray font-medium">Total Gas Saved</p>
              <Info class="ml-1 mt-1" text="Gas fee for rebalancing and reinvestment, including all pools of universe.finance" />
            </div>
          </div>
        </div>

        <div class="shadow rounded-lg py-5 px-5 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              {{ formatUsd(totalDeposit) }}
            </h3>
            <p class="mt-2 text-primary-gray font-medium">Your Positions</p>
          </div>
        </div>
        <div class="shadow rounded-lg py-5 px-5 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              {{ formatNumber(totalUNTReward) }} UNT
            </h3>
            <p class="mt-2 text-primary-gray font-medium">Your Rewards</p>
          </div>
        </div>
      </div> 
    </div>

    <div class="mt-[60px]">
      <div
        class="w-full flex flex-col mt-6 sm:flex-row sm:items-center sm:justify-between xl:mt-4"
      >
        <h2 class="text-primary-gray text-lg font-semibold">Your Positions</h2>

        <div class="mt-4 sm:mt-0 sm:mr-1">
          <SearchInput
            v-model.trim="search"
            dense
            class="w-[200px]"
            placeholder="Search positions"
          />
        </div>
      </div>
      <div
        class="mt-3 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xxl:gap-6 min-w-max-content px-1"
      >
        <div v-for="item in filteredVaults" :key="item.symbol">
          <card-universe
            :vault-name="item.vaultName"
            :vault="item.vaultAddress"
            :token-index="item.tokenIndex"
            :token-key="item.tokenSymbol.toLowerCase()"
            :supply="item.deposit"
            :supply-usd="item.depositInUsd"
            :type="item.type"
            :price-in-usd="item.price"
            :feeAprLifetime="item.feeAprLifetime"
            :untReward="item.untReward"
            :link="item.link"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import BackIcon from "~/assets/icons/back.svg?inline";
import { useUniversePosition } from "~/composables/protocols/useUniversePosition";
import { useUniverseOverview } from "~/composables/protocols/useUniverseOverview";
import { useFormatting } from "~/composables/useFormatting";
import { useSearchFilter } from "~/composables/useSearchFilter";
import CardUniverse from "~/components/protocols/CardUniverse.vue";
import UniverseIcon from "~/assets/icons/universe.svg?inline";
import ButtonCTAOutlined from "~/components/common/input/ButtonCTAOutlined.vue";

export default defineComponent({
  components: {
    BackIcon,
    CardUniverse,
    UniverseIcon,
    ButtonCTAOutlined,
  },
  setup() {
    const { overview } = useUniverseOverview();
    const { vaults, totalDeposit, totalUNTReward } = useUniversePosition();

    const { formatUsd, formatPercent, formatNumber } = useFormatting();

    const { filtered: filteredVaults, search } = useSearchFilter(
      vaults,
      "tokenSymbol",
      // "vaultName" 
    );

    return {
      overview,
      filteredVaults,
      totalDeposit,
      totalUNTReward,
      search,
      formatUsd,
      formatNumber,
      formatPercent
    };
  }
});
</script>
