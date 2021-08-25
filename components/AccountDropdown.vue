<template>
  <div>
    <div v-if="active && activeAccount" class="relative w-[193px]" v-click-outside="hide">
      <button
        type="button"
        class=" relative w-full border border-primary-blue-border rounded pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-[#0846E4] focus:border-[#0846E4] sm:text-sm"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        @click="show = !show"
      >
        <span
          class="flex items-center capitalize text-center text-sm font-bold"
        >
          <div class="mr-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0)">
                <path
                  d="M-7.86805e-07 0L0 18L18 18L18 -7.86805e-07L-7.86805e-07 0Z"
                  fill="#E31E1E"
                />
                <path
                  d="M3.2817 0.869955L-6.62695 15.8972L8.40031 25.8059L18.309 10.7786L3.2817 0.869955Z"
                  fill="#C81474"
                />
                <path
                  d="M-1.2122 23.2117L15.9165 28.7441L21.4489 11.6154L4.32022 6.08302L-1.2122 23.2117Z"
                  fill="#018E74"
                />
                <path
                  d="M-6.75923 -14.2457L-13.4438 2.46704L3.2689 9.15166L9.95352 -7.56108L-6.75923 -14.2457Z"
                  fill="#F58F00"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="18" height="18" rx="9" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          {{ shortenHash(activeAccount.address) }}
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
              fill="#000"
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
          <li
            class="cursor-pointer select-none relative py-3 pl-3 pr-9  hover:bg-primary-blue-dark/[0.07]"
            id="listbox-option-0"
            role="option"
          >
            <nuxt-link to="/authority" class="flex items-center font-semibold">
              <div class="mr-2.5">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.2181 14.2074C18.2872 13.8219 18.2872 13.4281 18.2181 13.0426L18.9035 12.6352C18.9832 12.5887 19.0177 12.493 18.9912 12.4027C18.8132 11.8121 18.5077 11.2762 18.1092 10.8332C18.0481 10.7648 17.9498 10.7484 17.8701 10.7949L17.1847 11.2023C16.8952 10.948 16.5631 10.7512 16.2045 10.6199V9.80508C16.2045 9.71211 16.1407 9.63008 16.053 9.61094C15.4606 9.47422 14.8576 9.47969 14.2944 9.61094C14.2068 9.63008 14.143 9.71211 14.143 9.80508V10.6199C13.7844 10.7512 13.4523 10.948 13.1627 11.2023L12.4774 10.7949C12.4003 10.7484 12.2994 10.7648 12.2383 10.8332C11.8398 11.2762 11.5343 11.8121 11.3563 12.4027C11.3297 12.493 11.3669 12.5887 11.444 12.6352L12.1293 13.0426C12.0603 13.4281 12.0603 13.8219 12.1293 14.2074L11.444 14.6148C11.3643 14.6613 11.3297 14.757 11.3563 14.8473C11.5343 15.4379 11.8398 15.9711 12.2383 16.4168C12.2994 16.4852 12.3977 16.5016 12.4774 16.4551L13.1627 16.0477C13.4523 16.302 13.7844 16.4988 14.143 16.6301V17.4449C14.143 17.5379 14.2068 17.6199 14.2944 17.6391C14.8868 17.7758 15.4899 17.7703 16.053 17.6391C16.1407 17.6199 16.2045 17.5379 16.2045 17.4449V16.6301C16.5631 16.4988 16.8952 16.302 17.1847 16.0477L17.8701 16.4551C17.9472 16.5016 18.0481 16.4852 18.1092 16.4168C18.5077 15.9738 18.8132 15.4379 18.9912 14.8473C19.0177 14.757 18.9805 14.6613 18.9035 14.6148L18.2181 14.2074ZM15.1764 14.9512C14.4644 14.9512 13.888 14.3551 13.888 13.625C13.888 12.8949 14.4671 12.2988 15.1764 12.2988C15.8857 12.2988 16.4648 12.8949 16.4648 13.625C16.4648 14.3551 15.8883 14.9512 15.1764 14.9512ZM7.95063 11C9.82879 11 11.351 9.4332 11.351 7.5C11.351 5.5668 9.82879 4 7.95063 4C6.07246 4 4.55027 5.5668 4.55027 7.5C4.55027 9.4332 6.07246 11 7.95063 11ZM13.2956 17.1934C13.2345 17.1605 13.1734 17.1223 13.1149 17.0867L12.9051 17.2125C12.7457 17.3055 12.565 17.3574 12.3844 17.3574C12.0948 17.3574 11.8159 17.2316 11.6166 17.0129C11.1305 16.4715 10.7586 15.8125 10.5487 15.1098C10.4026 14.6258 10.5992 14.1145 11.0242 13.8602L11.2341 13.7344C11.2314 13.6633 11.2314 13.5922 11.2341 13.5211L11.0242 13.3953C10.5992 13.1438 10.4026 12.6297 10.5487 12.1457C10.5726 12.0664 10.6072 11.9871 10.6337 11.9078C10.5328 11.8996 10.4345 11.875 10.3309 11.875H9.88724C9.29749 12.1539 8.64133 12.3125 7.95063 12.3125C7.25993 12.3125 6.60642 12.1539 6.01402 11.875H5.57038C3.59923 11.875 2 13.5211 2 15.55V16.6875C2 17.4121 2.57115 18 3.27513 18H12.6261C12.8944 18 13.1441 17.9125 13.3487 17.7676C13.3168 17.6637 13.2956 17.557 13.2956 17.4449V17.1934Z"
                    fill="#9FB0C9"
                  />
                </svg>
              </div>

              Account
            </nuxt-link>
          </li>

          <li
            @click="deactivate"
            class="cursor-pointer select-none relative py-3 pl-3 pr-9  hover:bg-primary-blue-dark/[0.07]"
            id="listbox-option-0"
            role="option"
          >
            <span class="flex items-center font-semibold text-[#F56565]">
              <div class="mr-2.5">
                <svg
                  width="19"
                  height="8"
                  viewBox="0 0 19 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.78065 0.5C4.78065 0.223858 5.01846 0 5.31183 0H6.37419C6.66756 0 6.90538 0.223858 6.90538 0.5V4.5H8.49893V7.5C8.49893 7.77614 8.26111 8 7.96774 8H6.37419C5.4941 8 4.78065 7.32843 4.78065 6.5V5.5H0.531183C0.237819 5.5 0 5.27614 0 5V3.5C0 3.22386 0.237819 3 0.531183 3H4.78065V0.5Z"
                    fill="#F56565"
                  />
                  <path
                    d="M14.2194 7.5C14.2194 7.77614 13.9815 8 13.6882 8L12.6258 8C12.3324 8 12.0946 7.77614 12.0946 7.5L12.0946 3.5L10.5011 3.5L10.5011 0.500003C10.5011 0.223861 10.7389 3.064e-06 11.0323 3.03986e-06L12.6258 2.90872e-06C13.5059 2.8363e-06 14.2194 0.671575 14.2194 1.5L14.2194 2.5L18.4688 2.5C18.7622 2.5 19 2.72386 19 3L19 4.5C19 4.77614 18.7622 5 18.4688 5L14.2194 5L14.2194 7.5Z"
                    fill="#F56565"
                  />
                </svg>
              </div>

              Disconnect
            </span>
          </li>
        </ul>
      </div>
    </div>
    <button
      v-if="!active"
      @click="activate"
      class="hidden md:flex bg-primary-blue-dark hover:bg-primary-blue-hover shadow text-white p-3 rounded h-9  items-center justify-center w-40"
    >
      Connect
    </button>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { useDSA } from "~/composables/useDSA";
import { useFormatting } from '~/composables/useFormatting';
import { useWeb3 } from '~/composables/useWeb3';

export default defineComponent({
  setup() {
    const { activeAccount } = useDSA()
    const { active, deactivate, activate } = useWeb3()
    const { shortenHash } = useFormatting()

    const show = ref(false)

    const hide = () => {
      show.value = false
    }

    return {
      hide,
      show,
      activeAccount,
      active,
      activate,
      deactivate,
      shortenHash,
    }

  },
})
</script>
