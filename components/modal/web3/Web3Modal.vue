<template>
  <div
    class="inline-block w-full max-w-md px-8 py-7 overflow-hidden text-left align-bottom transition-all transform bg-white border border-opacity-50 rounded-lg shadow-xl  dark:bg-dark-400 sm:my-8 sm:align-middle sm:p-6 border-green-light"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-headline"
  >
    <div>
      <div class="mt-3 text-center sm:mt-5">
        <h3 id="modal-headline" class="font-bold text-2xl">
          Connect your wallet
        </h3>
      </div>

      <div class="my-10">
        <button @click="connect">
          Metamask
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import Input from '~/components/common/input/Input.vue'
import { useModal } from '~/composables/useModal'
import { useWeb3 } from '@kabbouchi/vue-web3'
import { injected } from '~/connectors'
import ButtonCTA from '../../common/input/ButtonCTA.vue'
import ButtonCTAOutlined from '../../common/input/ButtonCTAOutlined.vue'

export default defineComponent({
  components: { ButtonCTA, ButtonCTAOutlined, Input },
  setup() {
    const { close } = useModal()
    const { activate } = useWeb3()

    const connect = async () => {
      await activate(injected)

      close()
    }

    return {
      close,
      connect
    }
  },
})
</script>
