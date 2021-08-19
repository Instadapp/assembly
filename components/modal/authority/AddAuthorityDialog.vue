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
          Add Authority
        </h3>
      </div>

      <div class="my-10">
        <div class="relative">
          <Input class="mr-4" v-model="authority" />

          <span
            v-if="!authority"
            class="absolute right-0 inset-y-0 mt-3 mr-4 uppercase text-[#1874FF] font-semibold text-xs"
            >Paste</span
          >
        </div>
      </div>

      <div class="flex justify-between items-center mt-4 sm:mt-6">
        <ButtonCTAOutlined class="flex-1 px-8 rounded" @click="close">
          Cancel
        </ButtonCTAOutlined>

        <ButtonCTA
          @click="createAuthorityHandler"
          class="ml-4 flex-1 px-8"
          :loading="creatingAuthority"
          :disabled="creatingAuthority"
        >
          create
        </ButtonCTA>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import Input from '~/components/common/input/Input.vue'
import { useDSA } from '~/composables/useDSA'
import { useModal } from '~/composables/useModal'
import ButtonCTA from '../../common/input/ButtonCTA.vue'
import ButtonCTAOutlined from '../../common/input/ButtonCTAOutlined.vue'

export default defineComponent({
  components: { ButtonCTA, ButtonCTAOutlined, Input },
  setup() {
    const { close } = useModal()
    const { createAuthority, creatingAuthority } = useDSA()

    const authority = ref();

    const createAuthorityHandler = async () => {
      await createAuthority(authority.value)
      close()
    }

    return {
      authority,
      close,
      createAuthorityHandler,
      creatingAuthority,
    }
  },
})
</script>
