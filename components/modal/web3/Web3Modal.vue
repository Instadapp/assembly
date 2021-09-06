<template>
  <div
    class="relative inline-block w-full max-w-md px-8 py-8 overflow-hidden text-left align-bottom transition-all transform bg-white  sm:my-16 sm:align-middle sm:p-6 "
    :class="{
      'border border-opacity-50 rounded-lg shadow-xl border-green-light': !slim
    }"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-headline"
  >
    <div
      :class="{
        'py-8': !slim
      }"
    >
      <div class="text-center">
        <h3 id="modal-headline" class="font-bold text-2xl text-[#374253]">
          Connect your wallet
        </h3>
      </div>

      <div class="mt-8 w-full space-y-4">
        <button
          class="w-full px-6 py-3 text-left flex items-center h-[80px] border border-[#DBE5F4] rounded-[4px] text-lg text-[#374253] font-semibold hover:bg-background-light"
          v-for="(wallet, key) in wallets"
          :key="key"
          @click="connect(wallet.connector)"
        >
          <div
            style="background: radial-gradient(42.15% 42.15% at 48.94% 48.94%, #D6DAE0 75.67%, #F0F3F9 100%), #C4C4C4;"
            class="mr-5 w-14 h-14 flex-shrink-0 rounded-full flex items-center justify-center border border-[#CCDCF3]"
          >
            <div
              class="w-10 h-10 rounded-full inline-flex items-center justify-center bg-white"
            >
              <component :is="wallet.iconURL" class="w-7 h-7 text-white" />
            </div>
          </div>

          {{ wallet.name }}
        </button>
      </div>

      <div class="mt-6 text-center text-sm hidden">
        Need help connecting a wallet?
        <nuxt-link to="/faqs" class="font-semibold text-ocean-blue-pure"
          >Read our FAQ</nuxt-link
        >
      </div>
    </div>

    <button v-if="!slim" class="absolute top-0 right-0 p-4" @click="close">
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.279403 0.279336C-0.0930443 0.651784 -0.0930442 1.25564 0.279403 1.62809L3.65128 4.99997L0.279336 8.37191C-0.0931119 8.74436 -0.0931119 9.34822 0.279336 9.72066C0.651783 10.0931 1.25564 10.0931 1.62809 9.72066L5.00003 6.34872L8.37191 9.7206C8.74436 10.0931 9.34822 10.0931 9.72066 9.7206C10.0931 9.34816 10.0931 8.7443 9.72066 8.37185L6.34878 4.99997L9.7206 1.62815C10.093 1.2557 10.093 0.651844 9.7206 0.279396C9.34815 -0.0930521 8.74429 -0.093052 8.37184 0.279396L5.00003 3.65121L1.62816 0.279336C1.25571 -0.093112 0.651851 -0.093112 0.279403 0.279336Z"
          fill="#1874FF"
        />
      </svg>
    </button>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import Input from '~/components/common/input/Input.vue'
import { useModal } from '~/composables/useModal'
import { useWeb3 } from '@instadapp/vue-web3'
import { injected } from '~/connectors'
import { SUPPORTED_WALLETS } from '~/constant/wallet'
import ButtonCTA from '../../common/input/ButtonCTA.vue'
import ButtonCTAOutlined from '../../common/input/ButtonCTAOutlined.vue'

export default defineComponent({
  props: {
    slim: {
      type: Boolean,
      default: false
    }
  },
  components: { ButtonCTA, ButtonCTAOutlined, Input },
  setup() {
    const { close } = useModal()
    const { activate } = useWeb3()

    const connect = async (connector) => {
      await activate(connector, console.log)

      close()
    }
    const isMetamask = computed(() => process.server ? false : window.ethereum && window.ethereum.isMetaMask)

    const wallets = computed(() => Object.keys(SUPPORTED_WALLETS).map((key) => {
      const wallet = SUPPORTED_WALLETS[key]

      if (wallet.connector === injected && !isMetamask.value) {
        return null
      }

      return wallet
    }).filter(Boolean))

    return {
      close,
      connect,
      wallets,
      isMetamask,
      injected,
    }
  },
})
</script>
