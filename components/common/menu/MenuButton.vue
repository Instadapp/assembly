<template>
  <Button
    color="white"
    class="border rounded-[6px] p-1.5 border-grey-light dark:border-opacity-25 dark:bg-opacity-100 dark:bg-dark-400"
    :style="`width: ${size}px; height: ${size}px`"
    v-on="$listeners"
  >
    <DotsHorizontal :style="`height: ${+size / 2}`" />
  </Button>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import DotsHorizontal from '@/assets/img/icons/heroicons/solid/dots-horizontal.svg?inline'

export default defineComponent({
  components: { DotsHorizontal },
  props: { size: { type: String, default: '30' } },
})
</script>

<style></style>
