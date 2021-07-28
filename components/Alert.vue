<template>
  <div class="p-2 bg-red-400 rounded-sm bg-opacity-17">
    <div class="flex">
      <div class="flex-shrink-0">
        <Icon name="x-circle" type="solid" class="w-5 h-5 text-red-500" />
      </div>
      <div class="ml-2">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({})
</script>
