<template>
  <div
    class="px-4 md:px-8 py-4 border border-b-[#E7E8F1] shadow flex flex-col md:flex-row md:items-center md:justify-between"
  >
    <nuxt-link to="/" class="flex items-center text-[#1874FF]">
      <svg
        width="28"
        height="26"
        viewBox="0 0 28 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.0779 0.655535C14.6014 -0.218507 13.3989 -0.218513 12.9224 0.655524L7.43746 10.7156C7.20102 11.1492 7.49979 11.6888 7.97635 11.6888L20.0238 11.6888C20.5004 11.6888 20.7991 11.1492 20.5627 10.7156L15.0779 0.655535Z"
          fill="currentColor"
        />
        <path
          d="M22.4164 14.1155C22.1793 13.6808 21.5821 13.678 21.3414 14.1105L15.2685 25.0217C15.0271 25.4554 15.3255 26 15.8046 26H26.7568C27.71 26 28.3075 24.9208 27.8346 24.0535L22.4164 14.1155Z"
          fill="currentColor"
        />
        <path
          d="M12.1952 26C12.6742 26 12.9727 25.4554 12.7313 25.0217L6.65864 14.1107C6.41791 13.6782 5.82069 13.6809 5.58364 14.1157L0.16539 24.0535C-0.307493 24.9208 0.290038 26 1.24316 26H12.1952Z"
          fill="currentColor"
        />
      </svg>

      <span class="ml-2 font-extrabold text-lg">ASSEMBLY</span>
    </nuxt-link>

    <div class="mt-8 md:mt-0 ml-auto flex items-center justify-center space-x-2.5">
      <button
        v-if="!active"
        @click="activate"
        class="hidden md:flex bg-primary-blue-dark hover:bg-primary-blue-hover shadow text-white p-3 rounded h-9  items-center justify-center w-40"
      >
        Connect
      </button>

      <button
        v-else
        @click="deactivate"
        class="hidden md:flex bg-primary-blue-dark hover:bg-primary-blue-hover shadow text-white p-3 rounded h-9 items-center justify-center w-40"
      >
        Disonnect
      </button>

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
