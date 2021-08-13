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
      <h1 class="text-primary-black text-2xl font-semibold">MakerDAO</h1>

      <dropdown-makerdao class="ml-auto"/>
    </div>

    <div class="mt-10">
      <h2 class="text-primary-gray text-lg font-semibold">Overview</h2>

      <div
        class="px-1 mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 xl:gap-[18px]"
      >
        <div class="shadow rounded-lg py-8 px-6 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              # {{ vaultId }}
            </h3>
            <p class="mt-4 text-primary-gray font-medium">Vault ID</p>
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
        <CardMakerdao
          :amount="collateral"
          :amount-usd="collateralUsd"
          position-type="supply"
          :token-key="tokenKey"
          :vault-token-type="vaultTokenType"
          :supply-or-borrow="showSupply"
          :withdraw-or-payback="showWithdraw"
          :price-in-usd="liquidationMaxPrice"
        />

        <CardMakerdao
          :amount="debt"
          :amount-usd="debt"
          position-type="borrow"
          token-key="dai"
          :vault-token-type="vaultTokenType"
          :supply-or-borrow="showBorrow"
          :withdraw-or-payback="showPayback"
          price-in-usd="1"
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
import CardMakerdao from "~/components/protocols/CardMakerdao.vue";
import { useBigNumber } from "~/composables/useBigNumber";
import { useFormatting } from "~/composables/useFormatting";
import { useMakerdaoPosition } from "~/composables/protocols/useMakerdaoPosition";
import { useStatus } from "~/composables/useStatus";
import { useNotification } from "~/composables/useNotification";
import DropdownMakerdao from "~/components/protocols/DropdownMakerdao.vue";

export default defineComponent({
  components: {
    BackIcon,
    CardMakerdao,
    SVGIncoming,
    SVGBalance,
    SVGEarnings,
    SVGArrowRight,
    SVGPercent,
    DropdownMakerdao
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
      vaults,
      vaultTokenType,
      collateral,
      collateralUsd,
      vaultId,
      liquidation,
      tokenKey,
      symbol,
      rate,
      netValue,
      liquidationPrice,
      liquidationMaxPrice,
      debt,
      minDebt,
      debtCeilingReached
    } = useMakerdaoPosition();

    const statusLiquidationRatio = computed(() =>
      div(status.value, liquidation.value).toFixed()
    );

    const { color, text } = useStatus(statusLiquidationRatio);

    function showSupply() {
      if (gt(debt.value, "0") && lt(debt.value, minDebt.value)) {
        // select("depositAndBorrow");
      } else if (vaults.value.length === 0) {
        router.push({ hash: "collateral" });
      } else {
        router.push({ hash: "supply" });
      }
    }
    function showWithdraw() {
      if (isZero(collateral.value)) {
        showWarning("MakerDAO", "No collateral supplied!!");
      } else if (gt(debt.value, "0") && lt(debt.value, minDebt.value)) {
        // select("paybackAndWithdraw");
      } else {
        router.push({ hash: "withdraw" });
      }
    }

    function showPayback() {
      if (isZero(collateral.value)) {
        showWarning("MakerDAO", "No collateral supplied!!");
      } else {
        router.push({ hash: "payback?tokenKey=dai" });
      }
    }

    function showBorrow() {
      if (isZero(collateral.value)) {
        showWarning("MakerDAO", "Deposit collateral before borrowing!!");
      } else {
        router.push({ hash: "borrow?tokenKey=dai" });
      }
    }

    return {
      formatUsd,
      formatUsdMax,
      formatPercent,
      formatDecimal,
      color,
      text,
      vaultTokenType,
      collateral,
      collateralUsd,
      vaultId,
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
      minDebt,
      debtCeilingReached
    };
  }
});
</script>
