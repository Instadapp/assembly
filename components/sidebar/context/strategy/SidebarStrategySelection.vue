<template>
  <SidebarContextContainer class="h-full overflow-hidden">
    <SidebarContextHeader class="xxl:hidden">Strategies</SidebarContextHeader>

    <div class="h-full overflow-y-scroll scrollbar-hover">
      <div class="mx-auto" style="max-width: 296px">
        <div class="py-2 sm:py-4">
          <div
            v-for="strategy in strategies"
            :key="strategy.meta.id"
            class="flex-shrink-0 flex flex-col px-6 py-4 mt-2 bg-background rounded cursor-pointer select-none first:mt-0 sm:mt-6 group hover:bg-selection"
            @click="select(strategy.meta.id)"
          >
            <div class="flex items-start justify-between mb-3">
              <h4 class="font-bold text-17 text-navi-pure-light dark:text-light">{{ strategy.meta.card.name }}</h4>
              <Badge v-if="!!strategy.meta.card.badge" :color="strategy.meta.card.badge.color">
                {{ strategy.meta.card.badge.text }}
              </Badge>
            </div>
            <div class="font-medium leading-snug text-12 text-grey-pure">{{ strategy.meta.card.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </SidebarContextContainer>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useStrategy } from '~/composables/strategies/useStrategy'

export default defineComponent({
  props : {
    protocol : {
      type : String,
      required : true,
    }
  },
  setup(props) {
    const { strategies, select } = useStrategy(props.protocol)

    return { strategies, select }
  },
})
</script>
