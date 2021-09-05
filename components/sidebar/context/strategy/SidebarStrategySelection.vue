<template>
  <SidebarContextContainer class="h-full overflow-hidden">
    <SidebarContextHeader class="xxl:hidden">Strategies</SidebarContextHeader>

    <div class="h-full overflow-y-scroll scrollbar-hover">
      <div class="mx-auto" style="max-width: 296px">
        <div class="py-2 sm:py-4">
          <div
            v-for="strategy in strategies"
            :key="strategy.name"
            @click="selectStrategy(strategy)"
            class="flex-shrink-0 flex flex-col px-6 py-4 mt-2 bg-background rounded cursor-pointer select-none first:mt-0 sm:mt-6 group hover:bg-selection"
          >
            <div class="flex items-start justify-between mb-3">
              <h4
                class="font-bold text-17 text-navi-pure-light dark:text-light"
              >
                {{ strategy.name }}
              </h4>
            </div>
            <div class="font-medium leading-snug text-12 text-grey-pure">
              {{ strategy.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </SidebarContextContainer>
</template>

<script>
import { defineComponent, useRouter } from '@nuxtjs/composition-api'
import { protocolStrategies } from '~/core/strategies'

export default defineComponent({
  props: {
    protocol: {
      type: String,
      required: true,
    }
  },
  setup(props) {
    const router = useRouter()

    const strategies = protocolStrategies[props.protocol] || [];

    function selectStrategy(strategy) {
      router.push({
        hash: `#strategy?protocol=${props.protocol}&strategy=${strategy.id}`
      })
    }

    return { strategies, selectStrategy, protocolStrategies }
  },
})
</script>