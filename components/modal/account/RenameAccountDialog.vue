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
          Rename Account
        </h3>
      </div>

      <div class="my-10">
        <div class="relative">
          <Input
            class="mr-4"
            v-model="accountName"
            placeholder="Account Name"
          />
        </div>
      </div>

      <div class="flex justify-between items-center mt-4 sm:mt-6">
        <ButtonCTAOutlined class="flex-1 px-8 rounded" @click="close">
          Cancel
        </ButtonCTAOutlined>

        <ButtonCTA @click="save" class="ml-4 flex-1 px-8">
          Save
        </ButtonCTA>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import Input from '~/components/common/input/Input.vue'
import { useModal } from '~/composables/useModal'
import { useAccountNames } from '~/composables/useAccountNames'
import ButtonCTA from '../../common/input/ButtonCTA.vue'
import ButtonCTAOutlined from '../../common/input/ButtonCTAOutlined.vue'
export default defineComponent({
  props: {
    accountId: {
      type: String,
      required: true,
    }
  },
  components: { ButtonCTA, ButtonCTAOutlined, Input },
  setup(props) {
    const { close } = useModal()
    const { setAccountName, getAccountName } = useAccountNames()

    const accountName = ref('')

    onMounted(() => {
      accountName.value = getAccountName(props.accountId)
    })

    const save = () => {
      setAccountName(props.accountId, accountName.value)

      close()
    }

    return {
      close,
      accountName,
      save,
    }
  },
})
</script>
