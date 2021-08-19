<template>
  <div class="flex flex-col flex-grow">
    <div class="flex flex-col flex-grow">
      <div v-if="loading" class="flex items-center justify-center">
        <Spinner class="w-6 h-6" />
      </div>
      <div v-else class="flex flex-col flex-grow">
        <div
          v-if="items.length"
          :class="[
            itemsWrapperClasses,
            { ' divide-y divide-grey-light divide-opacity-50': divided }
          ]"
        >
          <div v-for="(item, i) in items" :key="i">
            <slot name="default" :item="item" :index="i"></slot>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center flex-grow">
          <slot name="no-items"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    itemsWrapperClasses: {
      type: String,
      default: ''
    },
    divided: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style></style>
