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
            <OneInchIcon Icon class="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 class="ml-4 text-primary-black text-2xl font-semibold">1Inch</h1>
      </div>
    </div>

    <div class="mx-auto w-[512px] shadow rounded-[10px] px-8 py-12">
      <swap-card
        :on-swap="swap"
        @token0="sellToken = $event"
        @token1="buyToken = $event"
        @slippage="fee = $event"
        :token1Amount="buyToken ? buyToken.amount : '0'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from "@nuxtjs/composition-api";
import BackIcon from "~/assets/icons/back.svg?inline";
import OneInchIcon from "~/assets/icons/1inch.svg?inline";
import SwapCard from "~/components/swap/SwapCard.vue";
import wait from "waait";
import axios from "axios";
import { useToken } from "~/composables/useToken";
import { useBigNumber } from "~/composables/useBigNumber";
import { useNetwork } from "~/composables/useNetwork";

export default defineComponent({
  components: {
    BackIcon,
    OneInchIcon,
    SwapCard
  },
  setup() {
    const { toBN, pow, div } = useBigNumber();
    const { activeNetwork } = useNetwork();

    const { valInt } = useToken();
    const sellToken = ref();
    const buyToken = ref();
    const fee = ref("3.0");

    const swap = async (token0, token1, slippage) => {
      await wait(3000);
    };

    const fetchSwapInfo = async () => {
      if (!sellToken.value || !buyToken.value) return;

      if (!sellToken.value.amount || sellToken.value.amount === "0") {
        buyToken.value.amount = "0";
        return;
      }

      const { data } = await axios.get(
        `https://api.1inch.exchange/v3.0/${activeNetwork.value.chainId}/quote`,
        {
          params: {
            fromTokenAddress: sellToken.value.address,
            toTokenAddress: buyToken.value.address,
            amount: valInt(sellToken.value.amount, sellToken.value.decimals),
            fee: fee.value
          }
        }
      );

      const num = toBN(data.toTokenAmount);
      const multiplier = pow(10, buyToken.value.decimals);

      buyToken.value.amount = div(num, multiplier).toFixed(7);
    };

    watch([sellToken, buyToken, fee], fetchSwapInfo);
    let interval;

    onMounted(() => {
      interval = setInterval(fetchSwapInfo, 10000);
    });

    onBeforeUnmount(() => {
      if (interval) {
        clearInterval(interval);
      }
    });

    return {
      swap,
      fee,
      sellToken,
      buyToken
    };
  }
});
</script>
