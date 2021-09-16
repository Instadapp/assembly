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

    <div class="mt-10 flex items-center">
      <div class="flex items-center">
        <div
          style="background: radial-gradient(42.15% 42.15% at 48.94% 48.94%, #D6DAE0 75.67%, #F0F3F9 100%), #C4C4C4;"
          class="w-16 h-16 rounded-full flex items-center justify-center border border-[#CCDCF3]"
        >
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center bg-[#1874FF]"
          >
            <ReflexerIcon Icon class="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 class="ml-4 text-primary-black text-2xl font-semibold">Reflexer</h1>
      </div>

      <dropdown-reflexer class="ml-auto" />
    </div>

    <div class="mt-10">
      <h2 class="text-primary-gray text-lg font-semibold">Overview</h2>

      <div
        class="px-1 mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 xl:gap-[18px]"
      >
        <div class="shadow rounded-lg py-8 px-6 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              # {{ safeId }}
            </h3>
            <p class="mt-4 text-primary-gray font-medium">Safe ID</p>
          </div>
          <div class="flex items-center">
            <IconBackground
              name="cube"
              class="bg-blue-pure text-blue-pure"
              icon-class="h-7"
            />
          </div>
        </div>

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
              {{ formatPercent(rate) }}
            </h3>
            <p class="mt-4 text-primary-gray font-medium">Borrow Rate</p>
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
        <CardReflexer
          :amount="collateral"
          :amount-usd="collateralUsd"
          position-type="supply"
          :token-key="tokenKey"
          :safe-token-type="safeTokenType"
          :supply-or-borrow="showSupply"
          :withdraw-or-payback="showWithdraw"
          :price-in-usd="liquidationMaxPrice"
        />

        <CardReflexer
          :amount="debt"
          :amount-usd="debtUsd"
          position-type="borrow"
          token-key="rai"
          :safe-token-type="safeTokenType"
          :supply-or-borrow="showBorrow"
          :withdraw-or-payback="showPayback"
          :price-in-usd="raiInUsd"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, useRouter } from "@nuxtjs/composition-api";
import BackIcon from "~/assets/icons/back.svg?inline";
import SVGIncoming from "@/assets/img/icons/incoming.svg?inline";
import SVGBalance from "@/assets/img/icons/balance.svg?inline";
import SVGEarnings from "@/assets/img/icons/earnings.svg?inline";
import SVGArrowRight from "@/assets/img/icons/arrow-right.svg?inline";
import SVGPercent from "@/assets/img/icons/percent.svg?inline";
import CardReflexer from "~/components/protocols/reflexer/CardReflexer.vue";
import { useBigNumber } from "~/composables/useBigNumber";
import { useFormatting } from "~/composables/useFormatting";
import { useReflexerPosition } from "~/composables/protocols/useReflexerPosition";
import { useStatus } from "~/composables/useStatus";
import { useNotification } from "~/composables/useNotification";
import DropdownReflexer from "~/components/protocols/reflexer/DropdownReflexer.vue";
import ReflexerIcon from "~/assets/icons/reflexer.svg?inline";

export default defineComponent({
  components: {
    BackIcon,
    CardReflexer,
    SVGIncoming,
    SVGBalance,
    SVGEarnings,
    SVGArrowRight,
    SVGPercent,
    DropdownReflexer,
    ReflexerIcon
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

    const { showWarning } = useNotification();

    const {
      status,
      safes,
      safeTokenType,
      collateral,
      collateralUsd,
      safeId,
      liquidation,
      tokenKey,
      symbol,
      rate,
      netValue,
      liquidationPrice,
      liquidationMaxPrice,
      debt,
      debtUsd,
      minDebt,
      debtCeilingReached,
      raiInUsd,
      isNewSafe,
      safeType,
      safeTypes
    } = useReflexerPosition();

    const statusLiquidationRatio = computed(() =>
      div(status.value, liquidation.value).toFixed()
    );

    const { color, text } = useStatus(statusLiquidationRatio);

    function showSupply() {
      if (gt(debt.value, "0") && lt(debt.value, minDebt.value)) {
        // select("depositAndBorrow");
      } else if (safes.value.length === 0) {
        if (safeTypes.value.length === 0) {
        } else if (safeTypes.value.length === 1) {
          safeType.value = safeTypes.value[0].type;
          isNewSafe.value = true;
          router.push({ hash: "supply" });
        } else {
          router.push({ hash: "collateral" });
        }
      } else {
        router.push({ hash: "supply" });
      }
    }
    function showWithdraw() {
      if (isZero(collateral.value)) {
        showWarning("ReflexerDAO", "No collateral supplied!!");
      } else if (gt(debt.value, "0") && lt(debt.value, minDebt.value)) {
        // select("paybackAndWithdraw");
      } else {
        router.push({ hash: "withdraw" });
      }
    }

    function showPayback() {
      if (isZero(collateral.value)) {
        showWarning("ReflexerDAO", "No collateral supplied!!");
      } else {
        router.push({ hash: "payback?tokenKey=rai" });
      }
    }

    function showBorrow() {
      if (isZero(collateral.value)) {
        showWarning("ReflexerDAO", "Deposit collateral before borrowing!!");
      } else {
        router.push({ hash: "borrow?tokenKey=rai" });
      }
    }

    return {
      formatUsd,
      formatUsdMax,
      formatPercent,
      formatDecimal,
      color,
      text,
      safeTokenType,
      collateral,
      collateralUsd,
      safeId,
      liquidation,
      tokenKey,
      netValue,
      rate,
      symbol,
      status,
      liquidationPrice,
      liquidationMaxPrice,
      showWithdraw,
      showPayback,
      showBorrow,
      showSupply,
      debt,
      debtUsd,
      minDebt,
      debtCeilingReached,
      raiInUsd
    };
  }
});
</script>
