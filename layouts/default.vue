<template>
  <div class="min-h-screen font-sans antialiased text-primary-black">
    <Navbar />
    <div class="max-w-6xl mx-auto py-8">
      <div class="space-x-4">
        <button
          class="font-semibold text-primary-gray hover:text-primary-blue-dark h-[44px] w-[216px] rounded-[6px] p-5 inline-flex items-center justify-center shadow-lg"
        >
          <MakerDAOIcon class="mr-2 w-8 h-8" />

          Maker
        </button>

        <button
          class="font-semibold text-white h-[44px] w-[216px] rounded-[6px] p-5 inline-flex items-center justify-center shadow bg-primary-blue-dark hover:bg-primary-blue-hover "
        >
          <CompoundIcon class="mr-2 w-8 h-8" />

          Compound
        </button>

        <button
          class="font-semibold text-primary-gray hover:text-primary-blue-dark h-[44px] w-[216px] rounded-[6px] p-5 inline-flex items-center justify-center shadow-lg"
        >
          <AaveIcon class="mr-2 w-8 h-8" />

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
import MakerDAOIcon from '~/assets/icons/makerdao.svg?inline'
import CompoundIcon from '~/assets/icons/compound.svg?inline'
import AaveIcon from '~/assets/icons/aave.svg?inline'

export default defineComponent({
  components: {
    MakerDAOIcon,
    CompoundIcon,
    AaveIcon,
  }

})
</script>