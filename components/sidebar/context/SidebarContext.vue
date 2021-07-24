<template>
  <div
    class="absolute inset-y-0 right-0 z-10 flex flex-col w-full overflow-hidden transform shadow-xs xxl:translate-x-0 dark:shadow-none xxl-transform-none xxl:relative dark:bg-dark-500 bg-background"
    style="max-width: clamp(var(--min-width-app), var(--width-sidebar-context), 100%)"
    :class="{
      'translate-x-0 duration-300': isOpen,
      'translate-x-full duration-200': !isOpen
    }"
  >
    <client-only>
      <transition name="slideInRight" :duration="duration">
        <keep-alive include="SidebarStrategyOverview">
          <div
            :is="component"
            v-bind="props"
            style="width: clamp(var(--min-width-app), var(--width-sidebar-context), 100%)"
          ></div>
        </keep-alive>
      </transition>
    </client-only>
  </div>
</template>

<script>
import { computed, defineComponent, onErrorCaptured } from '@nuxtjs/composition-api'
import { useSidebar } from '@/composables/useSidebar'

export default defineComponent({
  setup() {
    const { close, isOpen, component, props } = useSidebar()

    const duration = computed(() => ({ enter: 300, leave: 300 }))
    onErrorCaptured(() => close())

    return { component, isOpen, props, duration }
  },
  errorCaptured() {
    return false
  },
})
</script>

<style scoped>
.slideInRight-enter-active {
  position: absolute;
  z-index: 1;
}
.slideInRight-leave-active {
  z-index: 0;
}
.slideInRight-enter-active,
.slideInRight-leave-active {
  transition: transform 0.3s ease-out;
}
.slideInRight-enter,
.slideInRight-leave-to {
  transform: translateX(100%);
}

.slideInLeft-enter-active {
  position: absolute;
  z-index: 1;
}
.slideInLeft-leave-active {
  z-index: 0;
}
.slideInLeft-enter-active,
.slideInLeft-leave-active {
  transition: transform 0.3s ease-out;
}
.slideInLeft-enter,
.slideInLeft-leave-to {
  transform: translateX(-100%);
}
</style>
