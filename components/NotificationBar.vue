<template>
  <div
    v-if="queue.length"
    class="fixed bottom-0 right-0 w-full px-2 pt-8 overflow-hidden sm:max-w-sm max-h-80"
    style="z-index: 99999999999"
  >
    <transition-group
      appear
      enter-active-class="slideInUp"
      leave-active-class="fadeOutRight"
      tag="div"
      class="flex flex-col w-full px-2 pb-4 space-y-4 overflow-y-auto max-h-72 scrollbar-hover"
    >
      <Notification
        v-for="item in queue"
        :key="item.key"
        :title="item.title"
        :body="item.body"
        :href="item.href"
        :icon="item.icon"
        :duration="item.duration"
        class="mr-2"
        @dismiss="close(item.key)"
      />
    </transition-group>
    <button
      v-if="queue.length > 1"
      color="white"
      class="absolute flex items-center px-2 py-1 font-medium leading-none bg-white border border-opacity-75 shadow-sm  dark:text-light dark:bg-dark-300 border-grey-light right-5 rounded-xs text-ocean-blue-pure focus:outline-none"
      style="top: 0px; font-size: 13px"
      @click="closeAll"
    >
      <Icon name="x" class="w-4 h-4 mr-1" />Clear all
    </button>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useNotification } from '~/composables/useNotification'

export default defineComponent({
  setup() {
    const { queue, close, closeAll } = useNotification()

    return { queue, close, closeAll }
  },
})
</script>

<style>
@keyframes slideInUp {
  from {
    transform: translate3d(0, 100%, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

.slideInUp {
  animation-name: slideInUp;
  animation-duration: 150ms;
}

@keyframes fadeOutRight {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}

.fadeOutRight {
  animation-name: fadeOutRight;
  animation-duration: 150ms;
}
</style>
