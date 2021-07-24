<template>
  <Card class="flex w-full pl-4 overflow-hidden border border-opacity-75 shadow-lg dark:bg-dark-300 border-grey-light">
    <div class="flex items-center w-full py-4">
      <IconNotification :icon="icon" />

      <!-- Notification with link  -->
      <template v-if="href">
        <div class="flex flex-col w-full px-4">
          <div class="font-medium text-12" :class="{ 'mb-2': !!body }">{{ title }}</div>
          <a
            :href="href"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center text-ocean-blue-pure dark:text-light dark:hover:text-white text-12"
          >
            <div class="">{{ body }} <Icon name="external-link" class="inline-block w-4 h-4" /></div>
          </a>
        </div>
      </template>

      <!-- Notification without link  -->
      <template v-else>
        <div class="flex flex-col w-full px-4">
          <div class="font-medium text-12" :class="{ 'mb-2': !!body }">{{ title }}</div>
          <div class="font-medium text-ocean-blue-pure dark:text-grey-pure text-12">{{ body }}</div>
        </div>
      </template>
    </div>

    <div class="flex w-12">
      <button
        class="h-full px-3 py-3 focus:outline-none text-grey-pure hover:text-brand dark:hover:text-light"
        @click="dismiss"
      >
        <Icon name="x" class="w-full" />
      </button>
    </div>
  </Card>
</template>

<script>
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import SVGExternalLink from '@/assets/icons/external-link.svg?inline'

export default defineComponent({
  components: {
    SVGExternalLink,
  },
  props: {
    title: { type: String, deafult: '' },
    body: { type: String, deafult: '' },
    href: { type: String, deafult: '' },
    icon: { type: String, deafult: '' },
    duration: { type: Number, deafult: 7000 },
  },
  setup(props, ctx) {
    function dismiss() {
      ctx.emit('dismiss')
    }

    onMounted(() => {
      if (props.duration) {
        setTimeout(dismiss, props.duration)
      }
    })

    return { dismiss }
  },
})
</script>
