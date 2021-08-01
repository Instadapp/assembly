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

    <div class="fixed bottom-0 right-0 mr-10 mb-16">
      <button
      @click="showSidebarBalances"
        class="px-9 h-[56px] bg-primary-blue-dark hover:bg-primary-blue-hover text-white rounded-[28px] text-lg font-semibold shadow flex items-center"
      >
        <svg
          class="mr-3"
          width="14"
          height="16"
          viewBox="0 0 14 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0)">
            <path
              d="M12.6109 4L2.1875 4C1.94578 4 1.75 3.77625 1.75 3.5C1.75 3.22375 1.94578 3 2.1875 3L12.6875 3C12.9292 3 13.125 2.77625 13.125 2.5C13.125 1.67156 12.5374 1 11.8125 1L1.75 1C0.783399 1 0 1.89531 0 3L0 13C0 14.1047 0.783399 15 1.75 15L12.6109 15C13.3771 15 14 14.3272 14 13.5L14 5.5C14 4.67281 13.3771 4 12.6109 4ZM11.375 10.5C10.8918 10.5 10.5 10.0522 10.5 9.5C10.5 8.94781 10.8918 8.5 11.375 8.5C11.8582 8.5 12.25 8.94781 12.25 9.5C12.25 10.0522 11.8582 10.5 11.375 10.5Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="14" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>

        Balance
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, useContext, useRoute, watch } from "@nuxtjs/composition-api";
import MakerDAOIcon from '~/assets/icons/makerdao.svg?inline'
import CompoundIcon from '~/assets/icons/compound.svg?inline'
import AaveIcon from '~/assets/icons/aave.svg?inline'
import { useWeb3 } from '~/composables/useWeb3'
import { init as initSidebars, useSidebar } from '~/composables/useSidebar'
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
    const { showSidebarBalances } = useSidebar()
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

        if (route.value.path.includes(['mainnet', 'polygon']) && route.value.path.includes(activeNetwork.value.id)) {
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
      showSidebarBalances,
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