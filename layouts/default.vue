<template>
  <div class="min-h-screen font-sans antialiased text-primary-black">
    <Navbar />
    <div class="max-w-6xl mx-auto py-12">
      <div>
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
import { useWeb3 } from '~/composables/useWeb3'

export default defineComponent({
  components: {
    MakerDAOIcon,
    CompoundIcon,
    AaveIcon,
  },
  setup() {
    const { active, activate, deactivate } = useWeb3();

    return {
      active,
      activate,
      deactivate,
    }
  }

})
</script>