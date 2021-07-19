<template>
  <div
    class="h-[68px] px-8 py-5 border border-b-[#E7E8F1] flex items-center justify-between"
  >
    <div class="flex items-center">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 26.6121C14 27.4159 14.6503 28.0751 15.4459 27.9931C22.4985 27.266 28 21.2786 28 14C28 6.72143 22.4985 0.734111 15.4459 0.00697811C14.6503 -0.0754852 14 0.584222 14 1.388V5.26862C14 6.0724 14.6546 6.70882 15.4391 6.86744C18.7489 7.53831 21.2414 10.4764 21.2414 14C21.2414 17.5236 18.7489 20.4618 15.4391 21.1326C14.6546 21.2913 14 21.9282 14 22.7314V26.6121ZM9.65517 2.62883C9.65517 1.63927 8.69111 0.941724 7.80814 1.37975C3.18187 3.67563 0 8.46432 0 14C0 19.5358 3.18187 24.3244 7.80814 26.6203C8.69111 27.0583 9.65517 26.3608 9.65517 25.3712V2.62883Z"
          fill="#3F75FF"
        />
      </svg>

      <span class="ml-2 font-extrabold text-lg">ASSEMBLY</span>
    </div>

    <div class="flex items-center space-x-2.5">
      <button
        v-if="!active"
        @click="activate"
        class="bg-primary-blue-dark hover:bg-primary-blue-hover shadow text-white p-3 rounded-[6px] h-9 flex items-center justify-center w-40"
      >
        Connect
      </button>

      <button
        v-else
        @click="deactivate"
        class="bg-primary-blue-dark hover:bg-primary-blue-hover shadow text-white p-3 rounded-[6px] h-9 flex items-center justify-center w-40"
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
