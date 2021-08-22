<template>
  <SidebarContextContainer class="h-full overflow-hidden">
    <SidebarContextHeader class="xxl:hidden">Strategy</SidebarContextHeader>

    <div class="h-full overflow-y-scroll scrollbar-hover">
      <div class="mx-auto" style="max-width: 296px">
        <div class="py-2 sm:py-4">
          <pre>{{ $props }}</pre>
        </div>
      </div>
    </div>
  </SidebarContextContainer>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useSidebar } from '~/composables/useSidebar';
import { protocolStrategies } from '~/core/strategies'

export default defineComponent({
  props: {
    protocol: {
      type: String,
      required: true,
    },
    strategy: {
      type: String,
      required: true,
    }
  },
  setup(props) {
    const { close } = useSidebar();

    // const strategies = protocolStrategies[props.protocol];

    // if (!strategies) {
    //   close()
    // }

    // const strategy = strategies.find(strategy => strategy.id === props.strategy);

    // if (!strategy) {
    //   close()
    // }

    return {
      //   strategy
    }
  },
})
</script>