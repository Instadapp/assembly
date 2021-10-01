<template>
  <SidebarContextContainer class="flex-1 h-full overflow-hidden">
    <SidebarContextHeader><slot name="title" /></SidebarContextHeader>

    <div class="overflow-y-scroll scrollbar-hover h-full">
      <div class="mx-auto w-full h-full">
        <div class="py-2 sm:py-4 h-full">
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
