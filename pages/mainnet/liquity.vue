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
            <LiquityIcon class="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 class="ml-4 text-primary-black text-2xl font-semibold">Liquity</h1>
      </div>

      <ButtonCTAOutlined
        class="px-4 h-9 w-[173px]"
        @click="$router.push({ hash: 'strategies?protocol=liquity' })"
      >
        Strategies

        <svg
          class="ml-auto"
          width="11"
          height="10"
          viewBox="0 0 11 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.3815 8.76139C4.38149 8.99703 4.64068 9.1407 4.8405 9.01581L10.859 5.25425C11.047 5.13675 11.047 4.86295 10.859 4.74545L4.84088 0.984069C4.64108 0.859187 4.38189 1.00283 4.38188 1.23845L4.38179 2.97869C4.38178 3.14437 4.24747 3.27867 4.08179 3.27867L1.23894 3.27867C1.07325 3.27867 0.93894 3.41299 0.93894 3.57867L0.93894 6.42096C0.93894 6.58664 1.07325 6.72096 1.23894 6.72096L4.08159 6.72096C4.24728 6.72096 4.3816 6.85528 4.38159 7.02097L4.3815 8.76139Z"
            fill="#1874FF"
          />
        </svg>
      </ButtonCTAOutlined>
    </div>

    <div class="mt-10">
      <h2 class="text-primary-gray text-lg font-semibold">Overview</h2>

      <div
        class="px-1 mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 xl:gap-[18px]"
      >
        <div class="shadow rounded-lg py-8 px-6 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              {{ formatUsd(netValue) }}
            </h3>
            <p class="mt-4 text-primary-gray font-medium">Net Value</p>
          </div>
          <div class="flex items-center">
            <SVGBalance />
          </div>
        </div>

        <div class="shadow rounded-lg py-8 px-6 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              {{ formatPercent(borrowFee) }}
            </h3>
            <p class="mt-4 text-primary-gray font-medium">Borrow Fee</p>
          </div>
          <div class="flex items-center">
            <SVGPercent class="h-12" />
          </div>
        </div>

        <div class="shadow rounded-lg py-8 px-6 flex">
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <h3 class="text-2xl text-primary-black font-medium">
                {{ formatPercent(status) }}
              </h3>
              <Badge class="w-18 xxl:w-23" :color="color">{{ text }}</Badge>
            </div>
            <div
              class="mt-4 flex justify-between items-center text-primary-gray font-medium"
            >
              <div class="flex items-center whitespace-no-wrap">
                <div>D/C (%)</div>

                <div class="ml-2"><Info text="Debt/Collateral ratio" /></div>
              </div>
              <span>Max - {{ formatPercent(liquidation) }}</span>
            </div>
          </div>
        </div>

        <div class="shadow rounded-lg py-8 px-6 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              {{ formatUsdMax(liquidationPrice, liquidationMaxPrice) }} /
              {{ formatUsd(liquidationMaxPrice) }}
            </h3>
            <p class="mt-4 text-primary-gray font-medium">Liquidation (ETH)</p>
          </div>
          <div class="flex items-center">
            <IconBackground
              name="receipt-tax"
              class="bg-light-brown-pure text-light-brown-pure"
            />
          </div>
        </div>
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
        <CardLiquityTrove
          v-if="troveOpened"
          :collateral="collateral"
          :amount-usd="collateralUsd"
          :price-in-usd="priceInUsd"
          position-type="supply"
          :token="collateralToken"
        />

        <CardLiquityTrove
          v-if="troveOpened"
          :debt="debt"
          :collateral="collateral"
          :amount-usd="debt"
          price-in-usd="1"
          position-type="borrow"
          :token="debtToken"
        />

        <button-dashed
          v-if="!troveOpened"
          color="ocean-blue"
          class="col-span-full"
          height="80px"
          full-width
          @click="openNewTrove"
        >
          <SVGAdd class="w-3 mr-2" />
          Open Trove
        </button-dashed>
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
import LiquityIcon from "~/assets/icons/liquity.svg?inline";
import ButtonDashed from "~/components/common/input/ButtonDashed.vue";
import { useLiquityPosition } from "~/composables/protocols/useLiquityPosition";
import { useFormatting } from "~/composables/useFormatting";
import { useStatus } from "~/composables/useStatus";
import { useBigNumber } from "~/composables/useBigNumber";
import CardLiquityTrove from "~/components/protocols/liquity/CardLiquityTrove.vue";
import ButtonCTAOutlined from "~/components/common/input/ButtonCTAOutlined.vue";

export default defineComponent({
  components: {
    BackIcon,
    LiquityIcon,
    ButtonDashed,
    SVGAdd,
    SVGBalance,
    SVGPercent,
    CardLiquityTrove,
    ButtonCTAOutlined,
  },
  setup() {
    const router = useRouter();

    const { div, isZero, gt, lt } = useBigNumber();

    const {
      formatUsd,
      formatUsdMax,
      formatPercent,
      formatDecimal
    } = useFormatting();

    const {
      troveOpened,
      netValue,
      borrowFee,
      status,
      liquidation,
      liquidationPrice,
      liquidationMaxPrice,
      collateral,
      collateralUsd,
      priceInUsd,
      debt,
      debtToken,
      collateralToken
    } = useLiquityPosition();

    const statusLiquidationRatio = computed(() =>
      div(status.value, liquidation.value).toFixed()
    );

    const { color, text } = useStatus(statusLiquidationRatio);

    function openNewTrove() {
      router.push({ hash: "trove-new" });
    }

    return {
      color,
      text,

      formatUsd,
      formatUsdMax,
      formatPercent,
      formatDecimal,

      troveOpened,
      netValue,
      borrowFee,
      status,
      liquidation,
      liquidationPrice,
      liquidationMaxPrice,
      collateral,
      collateralUsd,
      priceInUsd,
      debt,
      debtToken,
      collateralToken,

      openNewTrove
    };
  }
});
</script>
