<template>
  <SidebarContextContainer class="flex-1 h-full overflow-hidden">
    <SidebarContextHeader><slot name="title" /></SidebarContextHeader>

    <div class="overflow-y-scroll scrollbar-hover">
      <div class="mx-auto w-full">
        <div class="py-2 sm:py-4">
          <slot />
        </div>
      </div>
    </div>
  </SidebarContextContainer>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({})
</script>
