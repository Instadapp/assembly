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
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "@nuxtjs/composition-api";
import BackIcon from "~/assets/icons/back.svg?inline";
import LiquityIcon from '~/assets/icons/liquity.svg?inline'

export default defineComponent({
  components: {
    BackIcon,
    LiquityIcon,
  },
  setup() {
 
  }
});
</script>
