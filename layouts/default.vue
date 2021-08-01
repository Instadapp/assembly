<template>
  <div
    class="min-h-screen relative overflow-hidden font-sans antialiased text-primary-black"
  >
    <Navbar />
    <div class="max-w-6xl mx-auto py-12 overflow-x-hidden ">
      <div>
        <Nuxt />
      </div>
    </div>

    <Backdrop :show="isBackdropShown" @click="closeBackdrop" />

    <SidebarContext />

    <Modal />

    <NotificationBar />
  </div>
</template>

<script>
import { defineComponent, nextTick, useContext, useRoute, watch } from "@nuxtjs/composition-api";
import MakerDAOIcon from '~/assets/icons/makerdao.svg?inline'
import CompoundIcon from '~/assets/icons/compound.svg?inline'
import AaveIcon from '~/assets/icons/aave.svg?inline'
import { useWeb3 } from '~/composables/useWeb3'
import { init as initSidebars } from '~/composables/useSidebar'
import { useBackdrop } from '@/composables/useBackdrop'
import { useNetwork } from "~/composables/useNetwork";

export default defineComponent({
  components: {
    MakerDAOIcon,
    CompoundIcon,
    AaveIcon,
  },
  setup() {
    const { active, activate, deactivate, chainId } = useWeb3();
    const { activeNetwork, checkForNetworkMismatch } = useNetwork();
    const { isShown: isBackdropShown, close: closeBackdrop } = useBackdrop()
    const { redirect } = useContext()
    const route = useRoute()

    watch(isBackdropShown, () => {
      if (isBackdropShown.value) {
        document.body.classList.add('overflow-hidden')
      } else {
        document.body.classList.remove('overflow-hidden')
      }
    })

    initSidebars();

    // global routes guard
    watch(
      [activeNetwork, route],
      async () => {
        await nextTick()

        if (route.path === '/') {
          return;
        }

        if (!route.value.path.includes(activeNetwork.value.id)) {
          redirect('/')
        }
      }, { immediate: true })

    watch(chainId, (val) => {
      if (val) {
        checkForNetworkMismatch()
      }
    }, { immediate: true })

    return {
      active,
      activate,
      deactivate,
      isBackdropShown,
      closeBackdrop,
    }
  }

})
</script>

<style>
:root {
  --min-width-app: 320px;
  --width-sidebar-context: 385px;
  --width-container-main: 1016px;
  --height-navbar: 64px;
  --height-top-banner: 32px;

  @screen sm {
    --height-navbar: 82px;
  }
}
</style>