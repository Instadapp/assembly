<template>
  <div class="mt-0 md:mt-10 max-w-5xl mx-auto">
    <h1 class="font-semibold text-2xl text-center">Assembly Apps</h1>

    <div class="mt-4 md:mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:gap-4">
      <nuxt-link
        v-for="app in apps"
        :key="app.id"
        :to="app.url"
        class="relative flex flex-col items-center px-6 py-7 text-center rounded-[6px] cursor-pointer bg-white hover:bg-gray-50 "
        style="box-shadow: -4px -4px 8px rgba(232, 234, 243, 0.3), 4px 4px 12px rgba(220, 222, 231, 0.35);"
      >

        <component :is="app.icon" class="max-w-[5rem] max-h-[5rem]" />

        <h2 class="mt-4 font-semibold text-19">{{ app.name }}</h2>
        <p class="mt-2 text-sm font-regular text-grey-dark opacity-90 leading-normal">
          {{ app.description }}
        </p>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { useNetwork } from "~/composables/useNetwork";
import AaveIcon from "~/assets/icons/colored/aave-shadow.svg?inline";
import CompoundIcon from "~/assets/icons/colored/compound-shadow.svg?inline";
import MakerIcon from "~/assets/icons/colored/maker-shadow.svg?inline";
import InchIcon from "~/assets/icons/colored/1inch-shadow.svg?inline";
import UniswapIcon from "~/assets/icons/colored/uniswap-shadow.svg?inline";
import LiquityIcon from "~/assets/icons/colored/liquity-shadow.svg?inline";

const appsPerNetwork = {
  mainnet: [
    {
      id: "maker",
      icon: MakerIcon,
      name: "Maker",
      url: "/mainnet/maker",
      description: "Manage liquidity on Balancer from your Gnosis Safe"
    },
    {
      id: "compound",
      icon: CompoundIcon,
      name: "Compound",
      url: "/mainnet/compound",
      description: "Manage liquidity on Balancer from your Gnosis Safe"
    },
    {
      id: "aave-v2",
      icon: AaveIcon,
      name: "Aave",
      url: "/mainnet/aave-v2",
      description: "Lend and borrow straight from your Gnosis Safe"
    },
    {
      id: "1inch",
      icon: InchIcon,
      name: "1Inch",
      url: "#",
      description: "DEX aggregator with the best prices on the market"
    },
    {
      id: "uniswap",
      icon: UniswapIcon,
      name: "Uniswap",
      url: "#",
      description: "Manage liquidity on Balancer from your Gnosis Safe"
    },
    {
      id: "liquity",
      icon: LiquityIcon,
      name: "Liquity",
      url: "#",
      description: "Lend and borrow straight from your Gnosis Safe"
    },
  ],
  polygon: [
    {
      id: "aave-v2",
      icon: AaveIcon,
      name: "Aave v2",
      url: "/polygon/aave-v2",
      description: "Lend and borrow straight from your Gnosis Safe"
    }
  ]
};

export default defineComponent({
  setup() {
    const { activeNetworkId } = useNetwork();

    const apps = computed(() => appsPerNetwork[activeNetworkId.value]);

    return {
      apps
    };
  }
});
</script>
