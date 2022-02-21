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
            <UniswapIcon Icon class="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 class="ml-4 text-primary-black text-2xl font-semibold">Uniswap v3</h1>
      </div>
    </div>

    <div class="mx-auto w-[512px] shadow rounded-[10px] px-8 py-12">
      <swap-card
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import UniswapIcon from "~/assets/logo/uniswap.svg?inline";
import SwapCard from "~/components/swap/SwapCard.vue";
import BackIcon from "~/assets/icons/back.svg?inline";

export default defineComponent({
    components:{
        UniswapIcon,SwapCard,BackIcon
    },
    setup() {
        
    },
})
</script>
