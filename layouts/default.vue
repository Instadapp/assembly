<template>
  <div
    class="relative overflow-hidden font-sans antialiased text-primary-black"
  >
    <div class="min-h-screen flex flex-col">
      <Navbar />
      <div v-if="activeNetworkId" class="flex-1 overflow-x-hidden ">
        <div class="px-4 md:px-0 max-w-6xl mx-auto py-12">
          <Nuxt />
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center" v-else>
        <svg
          class="animate-spin h-12 w-12 text-[#1874FF]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <div class="text-center py-8">
        <a
          class="font-medium text-primary-blue-dark hover:text-primary-blue-hover hover:underline"
          href="https://github.com/Instadapp/assembly"
          target="_blank"
        >
          Contribute on GitHub
        </a>
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
          <g clip-path="url(#clip123)">
            <path
              d="M12.6109 4L2.1875 4C1.94578 4 1.75 3.77625 1.75 3.5C1.75 3.22375 1.94578 3 2.1875 3L12.6875 3C12.9292 3 13.125 2.77625 13.125 2.5C13.125 1.67156 12.5374 1 11.8125 1L1.75 1C0.783399 1 0 1.89531 0 3L0 13C0 14.1047 0.783399 15 1.75 15L12.6109 15C13.3771 15 14 14.3272 14 13.5L14 5.5C14 4.67281 13.3771 4 12.6109 4ZM11.375 10.5C10.8918 10.5 10.5 10.0522 10.5 9.5C10.5 8.94781 10.8918 8.5 11.375 8.5C11.8582 8.5 12.25 8.94781 12.25 9.5C12.25 10.0522 11.8582 10.5 11.375 10.5Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip123">
              <rect width="14" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>

        Balance
      </button>
    </div>

    <div v-if="active && canSimulate" class="fixed bottom-0 left-0 ml-10 mb-16">
      <button
        v-if="forkId"
        @click="stopSimulation"
        class="px-9 h-[56px] bg-primary-blue-dark hover:bg-primary-blue-hover text-white rounded-[28px] text-lg font-semibold shadow flex items-center"
      >
        Stop Simulation
      </button>
      <button
        v-else
        @click="startSimulation"
        class="px-9 h-[56px] bg-primary-blue-dark hover:bg-primary-blue-hover text-white rounded-[28px] text-lg font-semibold shadow flex items-center"
      >
        Start Simulation
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, onErrorCaptured, onMounted, useContext, useRoute, watch } from "@nuxtjs/composition-api";
import MakerDAOIcon from '~/assets/icons/makerdao.svg?inline'
import CompoundIcon from '~/assets/icons/compound.svg?inline'
import AaveIcon from '~/assets/icons/aave.svg?inline'
import { useWeb3 } from '~/composables/useWeb3'
import { init as initSidebars, useSidebar } from '~/composables/useSidebar'
import { useBackdrop } from '@/composables/useBackdrop'
import { useNetwork } from "~/composables/useNetwork";
import { useTenderly } from "~/composables/useTenderly";

export default defineComponent({
  components: {
    MakerDAOIcon,
    CompoundIcon,
    AaveIcon,
  },
  setup() {
    const { active, activate, deactivate, chainId } = useWeb3();
    const { activeNetworkId, activeNetwork, checkForNetworkMismatch } = useNetwork();
    const { isShown: isBackdropShown, close: closeBackdrop } = useBackdrop()
    const { redirect } = useContext()
    const { showSidebarBalances } = useSidebar()
    const { canSimulate, startSimulation, stopSimulation, forkId } = useTenderly()
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

    onErrorCaptured(() => {
      return false
    })

    return {
      active,
      activate,
      deactivate,
      isBackdropShown,
      closeBackdrop,
      showSidebarBalances,
      activeNetworkId,
      startSimulation,
      forkId,
      stopSimulation,
      canSimulate,
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