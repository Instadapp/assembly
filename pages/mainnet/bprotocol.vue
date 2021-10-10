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
            <BprotocolIcon class="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 class="ml-4 text-primary-black text-2xl font-semibold">B.Protocol</h1>
      </div>

    </div>

    <div class="mt-[60px]">
      <div
        class="w-full flex flex-col mt-6 sm:flex-row sm:items-center sm:justify-between xl:mt-4"
      >
        <h2 class="text-primary-gray text-lg font-semibold">Your Positions</h2>
      </div>
      <div
        class="mt-3 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xxl:gap-6 min-w-max-content px-1"
      > 
    
        <CardBprotocolBamm
          :amount="userBammInLusd"
          :amount-usd="userBammInUsd"
          :ethUserBalance="ethUserBalance"
          :stability-lqty-gain="unclaimedLqty"
          price-in-usd="1"
          :token="bammToken"
          :lusdUserBalance="lusdUserBalance"
        />

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, useRouter } from "@nuxtjs/composition-api";
import BackIcon from "~/assets/icons/back.svg?inline";
import SVGBalance from "@/assets/img/icons/balance.svg?inline";
import SVGPercent from "@/assets/img/icons/percent.svg?inline";
import SVGAdd from "~/assets/img/icons/add.svg?inline";
import BprotocolIcon from "~/assets/icons/b-protocol.svg?inline";
import ButtonDashed from "~/components/common/input/ButtonDashed.vue";
import { useFormatting } from "~/composables/useFormatting";
import { useStatus } from "~/composables/useStatus";
import { useBigNumber } from "~/composables/useBigNumber";
import CardLiquityTrove from "~/components/protocols/liquity/CardLiquityTrove.vue";
import ButtonCTAOutlined from "~/components/common/input/ButtonCTAOutlined.vue";
import { useBprotocolPosition } from '~/composables/protocols/useBprotocolPositions'
import CardBprotocolBamm from '~/components/protocols/bprotocol/CardBprotocolBamm.vue';

export default defineComponent({
  components: {
    BackIcon,
    BprotocolIcon,
    ButtonCTAOutlined,
    SVGBalance,
    SVGPercent,
    CardBprotocolBamm
  },
  setup() {
    const router = useRouter();
    const {formatDecimal} = useFormatting();
    const { 
      bammTotalSupply,
      bammUserBalance,
      ethTotal,
      ethUserBalance,
      lusdTotal,  
      lusdUserBalance,
      unclaimedLqty,
      userBammInLusd,
      bammToken,
      userBammInUsd,
      totalBammSupplyInUsd
    } = useBprotocolPosition()

    return {
      bammTotalSupply,
      bammUserBalance,
      ethTotal,
      ethUserBalance,
      lusdTotal,  
      lusdUserBalance,
      unclaimedLqty,
      formatDecimal,
      userBammInLusd,
      bammToken,
      userBammInUsd,
      totalBammSupplyInUsd
    };
  }
});
</script>
