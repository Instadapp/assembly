<template>
  <Card
    border-radius="rounded-xs"
    class="flex flex-col flex-grow pb-0 pl-4 pr-6 duration-200 transform cursor-pointer custom-block-card dark:bg-opacity-10"
    style="border-left: 6px solid #ff007a"
  >
    <div class="flex flex-col">
      <div class="grid grid-cols-4 gap-4 py-6">
        <div class="flex flex-col">
          <div class="text-16">{{ blockName }}</div>
          <Tag
            :logo="logo"
            :title="title"
            class="mt-2 border border-opacity-25 shadow-none rounded-xs border-grey-light w-max-content bg-grey-light bg-opacity-17"
          />
        </div>
        <div class="flex flex-col justify-center">
          <div class="text-14 text-grey-pure">Input</div>
          <div class="mt-2 font-medium text-14">{{ inputAmount }} {{ inputSymbol }}</div>
        </div>
        <div class="flex flex-col justify-center">
          <div class="text-14 text-grey-pure">Output</div>
          <div class="mt-2 font-medium text-14">{{ outputAmount }} {{ outputSymbol }}</div>
        </div>
        <div class="items-center justify-end hidden custom-block-card--actions">
          <Button class="w-10 h-10 mr-4 rounded-full" color="ocean-blue" @click="$emit('edit', id)">
            <Icon name="pencil" class="h-5" />
          </Button>
          <Button class="w-10 h-10 rounded-full" color="red" @click="$emit('delete', id)">
            <Icon name="trash" class="h-5" />
          </Button>
        </div>
      </div>
      <div
        v-if="slippageAmount"
        class="flex items-center h-12 font-medium border-t text-14 text-grey-pure border-grey-light dark:border-opacity-10"
      >
        Price Impact {{ slippageAmount }}%
      </div>
    </div>
  </Card>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useProtocolData } from '~/composables/useProtocolData'
import { useToken } from '~/composables/useToken'

export default defineComponent({
  props: {
    id: {
      type: Number,
      default: '',
    },
    blockName: {
      type: String,
      default: '',
    },
    slippageAmount: {
      type: String,
      default: '',
    },
    inputAmount: {
      type: String,
      default: '',
    },
    inputToken: {
      type: String,
      default: '',
    },
    outputAmount: {
      type: String,
      default: '',
    },
    outputToken: {
      type: String,
      default: '',
    },
    protocol: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const { logo, title } = useProtocolData(props.protocol.name)
    const { getTokenByKey } = useToken()

    const inputSymbol = computed(() => getTokenByKey(props.inputToken)?.symbol)
    const outputSymbol = computed(() => getTokenByKey(props.outputToken)?.symbol)

    return { logo, title, inputSymbol, outputSymbol }
  },
})
</script>

<style scoped>
.custom-block-card:hover .custom-block-card--actions {
  display: flex;
}
</style>
