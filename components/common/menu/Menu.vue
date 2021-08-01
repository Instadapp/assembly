<template>
  <client-only>
    <v-popover
      :popover-base-class="baseClass"
      popover-inner-class="menu-inner"
      popover-wrapper-class="menu-wrapper"
      placement="auto-start"
      offset="8"
      :delay="delay"
    >
      <slot name="activator"> </slot>

      <template slot="popover">
        <div
          v-close-popover="closeOnClick"
          :border-radius="borderRadius"
          class="flex overflow-hidden border border-opacity-50 shadow-lg border-grey-light dark:bg-dark-400"
          :class="{ 'py-2': !noPadding }"
        >
          <slot />
        </div>
      </template>
    </v-popover>
  </client-only>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    closeOnClick: { type: Boolean, default: true },
    borderRadius: { type: String, default: 'rounded' },
    noPadding: { type: Boolean, default: false },
    baseClass: { type: String, default: 'menu' },
    delay: { type: Object, default: () => ({ show: 100, hide: 200 }) },
  },
})
</script>

<style>
.menu {
  outline: none;
  min-width: 200px;
  z-index: 11;
}

.v-popover > .trigger {
  display: initial !important;
}
</style>
