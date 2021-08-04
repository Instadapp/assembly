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
          v-tooltip.bottom="tooltip"
          v-clipboard:copy="activeAccount.address"
          v-clipboard:success="onCopy"
          class="flex items-center px-8 mt-4 whitespace-no-wrap cursor-pointer select-none group"
          style="width: 220px"
        >
          <div
            class="flex-1 font-medium text-center text-ocean-blue-pure text-19"
          >
            {{ shortenHash(activeAccount.address) }}
          </div>

          <Icon
            v-if="!copied"
            name="clipboard-copy"
            type="outline"
            class="flex-shrink-0 w-6 h-6 ml-4 text-grey-pure group-hover:text-ocean-blue-pure"
          />
          <Icon
            v-else
            name="clipboard-check"
            type="outline"
            class="flex-shrink-0 w-6 h-6 ml-4 transform -translate-x-px text-ocean-blue-pure dark:text-light"
          />
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

export default defineComponent({
  props: {
    tokenKey: {}
  },
  setup() {
    const { activeAccount } = useDSA()

    const { shortenHash } = useFormatting()

    const { onCopy, tooltip, copied } = useCopiedToClipboardUx()

    return { activeAccount, shortenHash, onCopy, tooltip, copied }
  },
})
</script>

<style>
.blured {
  filter: blur(6px);
}
</style>
