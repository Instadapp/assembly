<template>
  <div
    class="flex flex-shrink-0 w-full border-b items border-grey-light dark:border-dark-600 h-navbar"
    style="min-height: var(--height-navbar)"
  >
    <div class="flex items-center w-full mx-auto" style="max-width: 296px">
      <button
        class="flex items-center justify-center py-2 mt-1 mr-5 text-opacity-50 group hover:text-opacity-100 focus:hover:text-opacity-100 text-grey-pure focus:outline-none dark:text-light dark:text-opacity-84"
        @click="back"
      >
        <SVGArrowLeft
          class="transition-transform duration-75 ease-out transform group-hover:-translate-x-1"
        />
      </button>
      <div class="w-full mt-1 font-semibold text-14"><slot /></div>
    </div>
    <!-- <button
      v-if="!!close"
      class="flex items-center justify-center p-2 mt-1 text-opacity-50 group hover:text-opacity-100 focus:hover:text-opacity-100 text-grey-pure focus:outline-none"
      @click="close"
    >
      <SVGClose />
    </button> -->
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import SVGClose from '@/assets/icons/close.svg?inline'
import SVGArrowLeft from '@/assets/icons/arrow-left.svg?inline'
import { useSidebar } from '~/composables/useSidebar'

export default defineComponent({
  components: {
    SVGClose,
    SVGArrowLeft,
  },
  setup() {
    const { back } = useSidebar()
    return { back }
  },
})
</script>
