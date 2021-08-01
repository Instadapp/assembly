<template>
  <div class="flex-shrink-0 w-full mx-auto p-4">
    <div class="flex justify-between items-center w-full">
      <div>
        <button
      v-if="showBackButton"
        class="flex items-center justify-center text-opacity-50 group hover:text-opacity-100 focus:hover:text-opacity-100 text-grey-pure focus:outline-none"
        @click="back"
      >
        <SVGArrowLeft
          class="transition-transform duration-75 ease-out transform group-hover:-translate-x-1"
        />
      </button>
      </div>

      <button
        class="flex items-center justify-center text-opacity-50 group hover:text-opacity-100 focus:hover:text-opacity-100 text-grey-pure focus:outline-none"
        @click="close"
      >
        <SVGClose class="w-3 h-3" />
      </button>
    </div>

    <div>
      <div class="w-full my-5 text-center text-primary-gray font-semibold text-lg"><slot /></div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import SVGClose from '@/assets/icons/close.svg?inline'
import SVGArrowLeft from '@/assets/icons/arrow-left.svg?inline'
import { useSidebar } from '~/composables/useSidebar'

export default defineComponent({
  props: {
    showBackButton: {
      type: Boolean,
      default: true
    }
  },
  components: {
    SVGClose,
    SVGArrowLeft,
  },
  setup() {
    const { back, close } = useSidebar()
    return { back, close }
  },
})
</script>
