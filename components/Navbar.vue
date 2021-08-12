<template>
  <div
    class="px-4 md:px-8 py-4 border border-b-[#E7E8F1] flex items-center justify-between flex-col md:flex-row bg-primary-blue-dark space-y-4 md:space-y-0"
  >
    <nuxt-link to="/" class="flex items-center">
      <svg width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.1549 0.705961C15.6443 -0.235315 14.356 -0.235321 13.8454 0.705949L7.96871 11.5398C7.71538 12.0069 8.03549 12.588 8.54609 12.588L21.4541 12.588C21.9647 12.588 22.2848 12.0069 22.0315 11.5399L16.1549 0.705961Z" fill="white"/>
        <path d="M24.0175 15.2013C23.7636 14.7331 23.1237 14.7301 22.8658 15.1959L16.3591 26.9465C16.1004 27.4135 16.4202 28 16.9335 28H28.668C29.6892 28 30.3295 26.8378 29.8228 25.9038L24.0175 15.2013Z" fill="white"/>
        <path d="M13.0663 28C13.5795 28 13.8993 27.4135 13.6407 26.9465L7.13426 15.1961C6.87633 14.7303 6.23645 14.7333 5.98248 15.2015L0.177204 25.9038C-0.329457 26.8378 0.310755 28 1.33195 28H13.0663Z" fill="white"/>
      </svg>
      <span class="ml-2 font-bold text-2xl text-white">Assembly</span>
    </nuxt-link>

    <div class="flex items-center justify-center space-x-2.5">
      <button
        v-if="!active"
        @click="activate"
        class="bg-primary-blue-darker hover:bg-primary-blue-hover border border-primary-blue-border text-white text-sm p-2 rounded flex items-center justify-center w-40"
      >
        Connect
      </button>

      <!-- <button
        v-else
        @click="deactivate"
        class="bg-primary-blue-darker hover:bg-primary-blue-hover border border-primary-blue-border text-white text-sm p-2 rounded flex items-center justify-center w-40"
      >
        Disonnect
      </button> -->

      <AccountSwitcher v-if="active" />

      <NetworkSwitcher />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { useWeb3 } from "~/composables/useWeb3";

export default defineComponent({
  setup() {
    const { active, activate, deactivate } = useWeb3();

    return {
      active,
      activate,
      deactivate
    };
  }
});
</script>
