<template>
  <div
    class="inline-block w-full max-w-md px-4 py-6 overflow-hidden text-left align-bottom transition-all transform bg-white border border-opacity-50 rounded-lg shadow-xl  dark:bg-dark-400 sm:my-8 sm:align-middle sm:p-6 border-green-light"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-headline"
  >
    <div>
      <div class="mt-3 text-center sm:mt-5">
        <h3 id="modal-headline" class="font-bold text-2xl">
          Remove Authority
        </h3>
        <p class="px-6 mt-4 text-[#9FB0C9]">
          this action will remove this account as authority
        </p>
      </div>

      <div
        class="border-b border-[#DBE5F4] py-4 text-sm text-center flex items-center justify-center"
      >
        <svg
          class="mr-2"
          width="12"
          height="14"
          viewBox="0 0 12 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 7C7.89375 7 9.42857 5.4332 9.42857 3.5C9.42857 1.5668 7.89375 0 6 0C4.10625 0 2.57143 1.5668 2.57143 3.5C2.57143 5.4332 4.10625 7 6 7ZM8.56607 7.89141L7.28571 13.125L6.42857 9.40625L7.28571 7.875H4.71429L5.57143 9.40625L4.71429 13.125L3.43393 7.89141C1.52411 7.98438 0 9.57852 0 11.55V12.6875C0 13.4121 0.575893 14 1.28571 14H10.7143C11.4241 14 12 13.4121 12 12.6875V11.55C12 9.57852 10.4759 7.98438 8.56607 7.89141Z"
            fill="#9FB0C9"
          />
        </svg>

        <div>
          {{ authority }}
        </div>
      </div>

      <div class="flex justify-between items-center mt-4 sm:mt-6">
        <ButtonCTAOutlined class="flex-1 px-8 rounded" @click="close">
          Cancel
        </ButtonCTAOutlined>

        <ButtonCTA
          @click="removeAuthorityHandler(authority)"
          class="ml-4 flex-1 px-8"
          :loading="removingAuthority"
          :disabled="removingAuthority"
        >
          Remove
        </ButtonCTA>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useDSA } from '~/composables/useDSA'
import { useModal } from '~/composables/useModal'
import ButtonCTA from '../../common/input/ButtonCTA.vue'
import ButtonCTAOutlined from '../../common/input/ButtonCTAOutlined.vue'

export default defineComponent({
  props: {
    authority: {
      type: String,
      required: true
    }
  },
  components: { ButtonCTA, ButtonCTAOutlined },
  setup() {
    const { close } = useModal()
    const { removeAuthority, removingAuthority } = useDSA()

    const removeAuthorityHandler = async (authority) => {
      await removeAuthority(authority)
      close()
    }

    return {
      close,
      removeAuthorityHandler,
      removingAuthority,
    }
  },
})
</script>
