<template>
  <div class="min-h-screen overflow-hidden  font-sans antialiased text-primary-black">
    <Navbar />
    <div class="max-w-6xl mx-auto py-12 overflow-x-hidden ">
      <div>
        <Nuxt />
      </div>
    </div>
    <SidebarContext class="grid-sidebar-context" />

    <NotificationBar />
  </div>
</template>

<script>
import { defineComponent } from "@nuxtjs/composition-api";
import MakerDAOIcon from '~/assets/icons/makerdao.svg?inline'
import CompoundIcon from '~/assets/icons/compound.svg?inline'
import AaveIcon from '~/assets/icons/aave.svg?inline'
import { useWeb3 } from '~/composables/useWeb3'
import { init as initSidebars } from '~/composables/useSidebar'
export default defineComponent({
  components: {
    MakerDAOIcon,
    CompoundIcon,
    AaveIcon,
  },
  setup() {
    const { active, activate, deactivate } = useWeb3();

    initSidebars();

    return {
      active,
      activate,
      deactivate,
    }
  }

})
</script>

<style>
:root {
  --min-width-app: 320px;
  --width-sidebar-context: 360px;
  --width-container-main: 1016px;
  --height-navbar: 64px;
  --height-top-banner: 32px;

  @screen sm {
    --height-navbar: 82px;
  }
}

.grid-sidebar-context {
  grid-row-start: navbar;
  grid-row-end: main;

  @screen xl {
    grid-area: sidebar-context;
  }
}
</style>