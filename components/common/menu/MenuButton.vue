<template>
  <Button
    color="white"
    class="border rounded-sm border-grey-light dark:border-opacity-25 dark:bg-opacity-100 dark:bg-dark-400"
    :style="`width: ${size}px; height: ${size}px`"
    v-on="$listeners"
  >
    <Icon name="dots-horizontal" :style="`height: ${+size / 2}`" />
  </Button>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: { size: { type: String, default: '30' } },
})
</script>

<style></style>
