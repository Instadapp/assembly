<template>
  <div>
    <h1 class="font-semibold text-2xl text-center">Assembly Apps</h1>

    <div class="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 xl:gap-6">
      <nuxt-link
        v-for="app in apps"
        :key="app.id"
        :to="app.url"
        class="relative flex flex-col items-center px-4 py-12 text-center rounded-[6px] cursor-pointer bg-white hover:bg-gray-50 shadow"
      >
        <div
          style="background: radial-gradient(42.15% 42.15% at 48.94% 48.94%, #D6DAE0 75.67%, #F0F3F9 100%), #C4C4C4;"
          class="w-20 h-20 rounded-full flex items-center justify-center"
        >
          <div
            style="background: linear-gradient(0deg, #FFFFFF, #FFFFFF), #C4C4C4"
            class="w-16 h-16 rounded-full flex items-center justify-center"
          >
            <component :is="app.icon" class="w-8 h-8" />
          </div>
        </div>

        <h2 class="mt-4 font-semibold text-19">{{ app.name }}</h2>
        <p class="mt-2 text-14 font-regular text-grey-dark opacity-90">
          {{ app.description }}
        </p>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { useNetwork } from "~/composables/useNetwork";
//@ts-ignore
import AaveIcon from "~/assets/icons/colored/aave.svg?inline";

const appsPerNetwork = {
  mainnet: [
    {
      id: "aave-v2",
      icon: AaveIcon,
      name: "Aave v2",
      url: "/mainnet/aave-v2",
      description: "Lend and borrow straight from your Gnosis Safe"
    }
  ],
  polygon: [
    {
      id: "aave-v2",
      icon: AaveIcon,
      name: "Aave v2",
      url: "/polygon/aave-v2",
      description: "Lend and borrow straight from your Gnosis Safe"
    },
    {
      id: "aave-v3",
      icon: AaveIcon,
      name: "Aave v3",
      url: "/polygon/aave-v2",
      description: "Lend and borrow straight from your Gnosis Safe"
    },
    {
      id: "aave-v4",
      icon: AaveIcon,
      name: "Aave v4",
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
