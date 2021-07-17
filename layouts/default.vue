<template>
  <div class="min-h-screen font-sans antialiased text-primary-black">
    <Navbar />
    <div class="max-w-6xl mx-auto py-8">
      <div class="space-x-4">
        <button
          class="font-semibold text-primary-gray h-[44px] w-[216px] rounded-[6px] p-5 inline-flex items-center justify-center shadow-lg"
        >
          Maker
        </button>
        <button
          class="font-semibold text-white h-[44px] w-[216px] rounded-[6px] p-5 inline-flex items-center justify-center shadow bg-primary-blue-dark hover:bg-primary-blue-hover "
        >
          Compound
        </button>
        <button
          class="font-semibold text-primary-gray h-[44px] w-[216px] rounded-[6px] p-5 inline-flex items-center justify-center shadow-lg"
        >
          Aave
        </button>
      </div>

      <div class="border border-b-[#E7E8F1] w-full my-6"></div>

      <div class="py-4">
        <Nuxt />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({

})
</script>