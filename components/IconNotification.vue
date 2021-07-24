<template>
  <div class="inline-flex justify-center item-center">
    <IconBackground
      v-if="icon === 'error'"
      name="exclamation"
      type="solid"
      class="text-passion-orange-pure bg-passion-orange-pure"
    />

    <IconBackground
      v-else-if="icon === 'warning'"
      name="exclamation"
      type="outline"
      class="text-yellow-pure bg-yellow-pure"
    />

    <IconBackground v-else-if="icon === 'success'" name="check" type="outline" class="text-green-pure bg-green-pure" />

    <IconBackground
      v-else-if="icon === 'info'"
      name="information-circle"
      type="outline"
      class="text-ocean-blue-pure bg-ocean-blue-light"
    />

    <IconBackground
      v-else-if="icon === 'logged-out'"
      name="logout"
      type="outline"
      class="text-orange-pure bg-orange-pure"
    />

    <IconBackground
      v-else-if="icon === 'logged-in'"
      name="login"
      type="outline"
      :no-opacity="true"
      class="text-ocean-blue-pure bg-ocean-blue-light"
    />

    <div v-else-if="icon === 'pending-transaction'" class="relative text-ocean-blue-pure dark:text-white">
      <SVGPending class="w-12 h-12" />
      <Spinner class="absolute w-5 h-5 opacity-50 bottom-2 right-2" />
    </div>
    <Spinner v-else-if="icon === 'spinner'" class="w-12 h-12" />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import SVGPending from '@/assets/icons/pending.svg?inline'

export default defineComponent({
  components: {
    SVGPending,
  },
  props: {
    icon: { type: String, required: true },
  },
  setup() {
  },
})
</script>
