<template>
  <div class="relative w-[160px] md:w-[178px]" v-click-outside="hide" v-if="activeAccount">
    <button
      type="button"
      class="bg-primary-blue-darker hover:bg-primary-blue-hover relative w-full border border-primary-blue-border rounded pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-[#0846E4] focus:border-[#0846E4] sm:text-sm"
      aria-haspopup="listbox"
      aria-expanded="true"
      aria-labelledby="listbox-label"
      @click="show = !show"
    >
      <span
        class="flex items-center capitalize text-white text-sm font-medium"
      >
        <span class="hidden md:block text-white text-sm mr-2.5">
          Account
        </span>
        #{{ activeAccount.id }}
      </span>
      <span
        class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
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
            :fill="show ? '#fff' : '#fff'"
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
        class="w-full bg-primary-blue-dark border border-primary-blue-border shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm divide-y divide-primary-blue-border"
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
          v-for="account in accounts"
          :key="account.id"
          @click="setAccount(account)"
          class="cursor-pointer select-none relative py-3 pl-3 pr-9  hover:bg-primary-blue-hover"
          id="listbox-option-0"
          role="option"
        >
          <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
          <span class="flex items-center text-white">
            <div class="mr-2">
              <span
                class="text-white flex-grow-0 flex-shrink-0 bg-primary-blue-border shadow-sm rounded text-[10px] p-1"
              >
                v{{ account.version }}
              </span>
            </div>
            
            #{{ account.id }}

          </span>

          <span
            v-if="activeAccount.id === account.id"
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
                fill="#fff"
              />
            </svg>
          </span>
        </li>

        <li
          @click="createAccount"
          class="cursor-pointer select-none relative py-3 px-3 hover:bg-primary-blue-hover"
          id="listbox-option-0"
          role="option"
        >
          <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
          <span class="flex items-center text-xs justify-center text-white">
            <span class="text-white mr-1">+</span> Create New
          </span>
        </li>
      </ul>
    </div>
  </div>

  <button
    class="bg-primary-blue-darker hover:bg-primary-blue-hover border border-primary-blue-border text-white text-sm p-2 rounded flex items-center justify-center w-40"
    @click="createAccount"
    v-else
  >
    Create Account
  </button>
</template>

<script>
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { useBalances } from '~/composables/useBalances';
import { useDSA } from "~/composables/useDSA";

export default defineComponent({
  setup() {
    const { accounts, activeAccount, createAccount, creatingAccount, setAccount } = useDSA()
    const { fetchBalances } = useBalances()

    const show = ref(false)

    const hide = () => {
      show.value = false
    }

    watch(activeAccount, hide);
    watch(activeAccount, (val) => val && fetchBalances(true));

    return {
      hide,
      show,
      accounts,
      activeAccount,
      createAccount,
      creatingAccount,
      setAccount,
    }

  },
})
</script>
