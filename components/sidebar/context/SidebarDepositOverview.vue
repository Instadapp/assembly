<template>
  <SidebarContextRootContainer>
    <template #title
      >Deposit <span class="uppercase">{{ tokenKey }}</span></template
    >
    <div class="relative">
      <div
        v-if="activeAccount"
        class="flex flex-col items-center justify-center px-8 mt-6 mb-8"
      >
        <QrCode
          v-if="
            activeAccount.address !==
              '0x0000000000000000000000000000000000000000'
          "
          :value="activeAccount.address"
          :width="220"
        />

        <div
          v-if="
            activeAccount.address !==
              '0x0000000000000000000000000000000000000000'
          "
          class="bg-primary-blue-dark bg-opacity-5 rounded-[6px] py-3 px-4 mt-16 w-full"
        >
          <h3 class="font-bold text-primary-gray text-xs">
            <span class="uppercase">{{ tokenKey }}</span> Deposit Address
          </h3>

          <div class="flex justify-between items-start mt-4">
            <div class="mr-4 text-lg font-medium text-grey-dark break-all">
              {{ activeAccount.address }}
            </div>

            <button
              v-tooltip.bottom="tooltip"
              v-clipboard:copy="activeAccount.address"
              v-clipboard:success="onCopy"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 5H6C5.46957 5 4.96086 5.21071 4.58579 5.58579C4.21071 5.96086 4 6.46957 4 7V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V18M8 5C8 5.53043 8.21071 6.03914 8.58579 6.41421C8.96086 6.78929 9.46957 7 10 7H12C12.5304 7 13.0391 6.78929 13.4142 6.41421C13.7893 6.03914 14 5.53043 14 5M8 5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H12C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5M14 5H16C16.5304 5 17.0391 5.21071 17.4142 5.58579C17.7893 5.96086 18 6.46957 18 7V10M20 14H10M10 14L13 11M10 14L13 17"
                  stroke="#A5ADC6"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="text-primary-gray mt-9">
          <h3 class="font-bold">Important</h3>
          <div class="text-xs font-medium mt-4 flex items-start">
              <SVGInfo class="mr-2" /> 
              <p>Send <span class="uppercase">{{ tokenKey }}</span> or ERC20 tokens to this address on <span class="capitalize">{{ activeNetworkId }}</span> only.</p>
          </div>
        </div>
      </div>
    </div>
  </SidebarContextRootContainer>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useFormatting } from '~/composables/useFormatting'
import { useDSA } from '~/composables/useDSA'
import { useCopiedToClipboardUx } from '~/composables/useCopiedToClipboardUx'
import Icon from '~/components/Icon.vue'
import Button from '~/components/Button.vue'
import { useNetwork } from '~/composables/useNetwork'
import SVGInfo from '@/assets/icons/info.svg?inline'
export default defineComponent({
  components: { SVGInfo, Icon, Button },
  props: {
    tokenKey: {}
  },
  setup() {
    const { activeAccount } = useDSA()

    const { activeNetworkId } = useNetwork()

    const { shortenHash } = useFormatting()

    const { onCopy, tooltip, copied } = useCopiedToClipboardUx()

    return { activeAccount, shortenHash, onCopy, tooltip, copied, activeNetworkId }
  },
})
</script>

<style>
.blured {
  filter: blur(6px);
}
</style>
