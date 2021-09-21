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
            <CompoundIcon class="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 class="ml-4 text-primary-black text-2xl font-semibold">Yearn</h1>
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
          <card-yearn
            :vault="item.address"
            :token-key="item.token.display_name.toLowerCase()"
            :supply="item.position.supply"
            :supply-usd="item.position.supplyUsd"
            :type="item.type"
            :price-in-usd="item.priceInUsd"
            :netAPY="item.apy.net_apy"

          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "@nuxtjs/composition-api";
import BackIcon from "~/assets/icons/back.svg?inline";
import { useYearnV2Position } from "~/composables/protocols/useYearnV2Position";
import { useFormatting } from "~/composables/useFormatting";
import { useSearchFilter } from "~/composables/useSearchFilter";
import CardYearn from "~/components/protocols/yearn-v2/CardYearn.vue";
import CompoundIcon from "~/assets/icons/compound.svg?inline";
import ButtonCTAOutlined from "~/components/common/input/ButtonCTAOutlined.vue";

export default defineComponent({
  components: {
    BackIcon,
    CardYearn,
    CompoundIcon,
    ButtonCTAOutlined,
  },
  setup() {
    const { vaults } = useYearnV2Position();

    const { formatUsd, formatPercent } = useFormatting();

    const { filtered: filteredVaults, search } = useSearchFilter(
      vaults,
      "key",
      "type"
    );

    return {
      filteredVaults,
      search,
      formatUsd,
      formatPercent
    };
  }
});
</script>
