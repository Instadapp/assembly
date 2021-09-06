<template>
  <div v-if="!isGnosisSafe" class="relative w-1/2 md:w-[178px]" v-click-outside="hide">
    <button
      type="button"
      class="bg-primary-blue-dark hover:bg-primary-blue-hover relative w-full border border-primary-blue-border rounded pl-2.5 pr-10 py-1.5 text-left focus:outline-none focus:ring-1 focus:ring-[#0846E4] focus:border-[#0846E4] sm:text-sm"
      aria-haspopup="listbox"
      aria-expanded="true"
      aria-labelledby="listbox-label"
      @click="show = !show"
    >
      <span class="flex items-center capitalize font-medium text-sm text-white">
        <component :is="activeNetwork.icon" class="w-6 h-6 mr-2" />

        {{ activeNetwork.name }}
      </span>
      <span
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <svg
          :class="{ 'rotate-180': show }"
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 5.75L6.20711 6.45711C5.81658 6.84763 5.18342 6.84763 4.79289 6.45711L5.5 5.75ZM1.29289 2.95711L0.585786 2.25L2 0.835786L2.70711 1.54289L1.29289 2.95711ZM8.29289 1.54289L9 0.835786L10.4142 2.25L9.70711 2.95711L8.29289 1.54289ZM4.79289 6.45711L1.29289 2.95711L2.70711 1.54289L6.20711 5.04289L4.79289 6.45711ZM4.79289 5.04289L8.29289 1.54289L9.70711 2.95711L6.20711 6.45711L4.79289 5.04289Z"
            fill="#fff"
          />
        </svg>
      </span>
    </button>

    <!--
      Select popover, show/hide based on select state.

      Entering: ""
        From: ""
        To: ""
      Leaving: "transition ease-in duration-100"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div v-show="show" class="w-full px-2 absolute z-10 mt-0.5">
      <ul
        class="w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm divide-y divide-[#556D9C]/8"
        tabindex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3"
      >
        <!--
        Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

        Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"
      -->
        <li
          v-for="network in networks"
          :key="network.id"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9"
          id="listbox-option-0"
          role="option"
          @click="setActiveNetwork(network.id)"
        >
          <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
          <span class="flex items-center">
            <component :is="network.icon" class="w-6 h-6 mr-2 text-primary-blue-dark" />

            {{ network.name }}
          </span>

          <!--
          Checkmark, only display for selected option.

          Highlighted: "text-white", Not Highlighted: "text-indigo-600"
        -->
          <span
            v-if="activeNetwork.id === network.id"
            class="text-primary-blue-dark absolute inset-y-0 right-0 flex items-center pr-4"
          >
            <svg
              width="8"
              height="10"
              viewBox="0 0 8 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.5 5.86603C-0.166667 5.48113 -0.166667 4.51888 0.5 4.13397L6.5 0.669874C7.16667 0.284973 8 0.766099 8 1.5359L8 8.4641C8 9.2339 7.16667 9.71503 6.5 9.33013L0.5 5.86603Z"
                fill="#3F75FF"
              />
            </svg>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, ref, computed } from '@nuxtjs/composition-api'
import { useNetwork } from '~/composables/useNetwork'
import { useTenderly } from '~/composables/useTenderly'
import { useWeb3 } from '@instadapp/vue-web3'
import { gnosisSafe } from '~/connectors'

export default defineComponent({
  setup() {
    const show = ref(false)

    const { connector } = useWeb3()
    const { networks, activeNetworkId, activeNetwork, checkForNetworkMismatch } = useNetwork()
    const { stopSimulation } = useTenderly()
    
    const isGnosisSafe = computed(() => connector.value === gnosisSafe)

    const setActiveNetwork = async networkId => {
      await stopSimulation()
      activeNetworkId.value = networkId;
      show.value = false
      await nextTick()
      checkForNetworkMismatch()
    }

    const hide = () => {
      show.value = false
    }

    return {
      hide,
      show,
      networks,
      activeNetwork,
      setActiveNetwork,
      activeNetworkId,
      isGnosisSafe,
    }

  },
})
</script>
