<template>
  <div
    class="inline-block w-full max-w-sm px-4 py-6 overflow-hidden text-left align-bottom transition-all transform bg-white border border-opacity-50 rounded-lg shadow-xl  dark:bg-dark-400 sm:my-8 sm:align-middle sm:p-6 border-green-light"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-headline"
  >
    <div class="mt-3 text-center sm:mt-5">
      <h3 id="modal-headline" class="font-semibold text-19 dark:text-light">
        Switch to <span class="capitalize">{{ activeNetwork.name }}</span>
      </h3>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="px-6 mt-6 font-medium">
        Change the wallet network to
        <span class="capitalize">{{ activeNetwork.name }}</span> to proceed.
      </p>
    </div>

    <div class="flex justify-center mt-4 sm:mt-6">
      <ButtonCTA class="px-8" @click="switchAndClose">
        Switch to {{ activeNetwork.name }}
      </ButtonCTA>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useModal } from '~/composables/useModal'
import { useNetwork } from '~/composables/useNetwork'
import ButtonCTA from '../common/input/ButtonCTA.vue'

export default defineComponent({
  components: { ButtonCTA },
  setup() {
    const { close } = useModal()
    const { activeNetwork, switchNetwork } = useNetwork()

    async function switchAndClose() {
      try {
        await switchNetwork()

        close()
      } catch (error) { }
    }

    return { switchAndClose, activeNetwork }
  },
})
</script>
