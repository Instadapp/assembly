<template>
  <div class="py-6 space-y-6">
    <div v-for="(protocol, i) in items" :key="i">
      <div class="text-16">{{ protocol.name }}</div>
      <div class="mt-4 space-y-4">
        <Card
          v-for="(block, j) in protocol.blocks"
          :key="j"
          class="flex items-center p-4 select-none dark:bg-opacity-10"
        >
          <div class="flex flex-col pr-4">
            <div class="font-medium text-14 text-navi-pure dark:text-light">
              {{ block.name }}
            </div>
          </div>
          <Button class="ml-auto w-18" color="ocean-blue" @click="startNewBlockSetup(protocol, block)">Add</Button>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useCustomBlocks } from '~/composables/useCustomBlocks'
export default defineComponent({
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const { startNewBlockSetup } = useCustomBlocks()

    return { startNewBlockSetup }
  },
})
</script>

<style></style>
