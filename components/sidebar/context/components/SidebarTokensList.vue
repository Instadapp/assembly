<template>
  <div class="py-6 space-y-4">
    <Card
      v-for="token in items"
      :key="token.key"
      class="flex items-center px-4 py-4 cursor-pointer first:mt-0 group hover:bg-selection dark:hover:bg-dark-300"
      :class="{
        'bg-selection dark:bg-dark-300': isActiveToken(token.key),
        'bg-white dark:bg-dark-400': !isActiveToken(token.key),
      }"
      @click="select(token.key)"
    >
      <IconCurrency :currency="token.key" />
      <div class="flex flex-col px-4">
        <div
          class="mb-1 font-semibold text-12"
          :class="{
            'text-navi-pure-light dark:text-light': !isActiveToken(token.key),
            'text-ocean-blue-pure': isActiveToken(token.key),
          }"
        >
          {{ token.name }}
        </div>
        <div class="font-medium whitespace-no-wrap text-12 text-grey-pure">{{ token.symbol }}</div>
      </div>

      <div class="flex flex-col ml-auto text-right">
        <div
          class="mb-1 font-semibold whitespace-no-wrap text-12"
          :class="{
            'text-navi-pure-light dark:text-light': !isActiveToken(token.key),
            'text-ocean-blue-pure': isActiveToken(token.key),
          }"
        >
          {{ formatDecimal(token.balance) }}
        </div>
        <div class="whitespace-no-wrap font-regular text-12 text-grey-pure">{{ formatUsd(token.netWorth) }}</div>
      </div>
    </Card>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useFormatting } from '~/composables/useFormatting'

export default defineComponent({
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    activeToken: {
      type: String,
      default: null,
    },
  },
  setup(props, context) {
    function isActiveToken(tokenKey) {
      return props.activeToken === tokenKey
    }

    function select(tokenKey) {
      context.emit('currency-selected', tokenKey)
    }

    const { formatDecimal, formatUsd } = useFormatting()

    return { isActiveToken, select, formatDecimal, formatUsd }
  },
})
</script>

<style></style>
