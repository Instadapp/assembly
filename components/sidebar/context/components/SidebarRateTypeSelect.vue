<template>
  <div>
    <div class="flex items-center">
      <ValueDisplayLabel class="leading-none">APR type</ValueDisplayLabel>
      <Info class="ml-2" :text="tooltipARP" />
    </div>
    <div v-if="stableBorrowEnabled" class="flex mt-2">
      <ButtonBullet
        v-for="item in items"
        :key="item.value"
        :value="value"
        :label="computeLabel(item)"
        class="flex-1"
        :checked="isActive(item.value)"
        @change="$emit('input', item)"
      />
    </div>
    <div v-else class="flex mt-2 font-medium">Variable rate only support</div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import { useFormatting } from '~/composables/useFormatting'

export default defineComponent({
  props: {
    value: { type: Object, default: () => {} },
    items: { type: Array, default: () => [] },
    stableBorrowEnabled: { type: Boolean, default: false },
    borrowStableRate: { type: String, default: '' },
  },
  setup(props, ctx) {
    const { formatPercent } = useFormatting()

    function isActive(itemValue) {
      return itemValue === props.value?.value
    }

    function setupDefaultValue() {
      if (Array.isArray(props.items) && props.items.length > 0) {
        ctx.emit('input', props.items[0])
      }
    }

    function computeLabel(item) {
      if (item.value === 'stable') {
        return `${item.label} (${formatPercent(props.borrowStableRate)})`
      }
      return item.label
    }

    onMounted(() => {
      if (!props.value) {
        setupDefaultValue()
      }
    })

    const tooltipARP = `<b>Annual Percentage Rate</b><br/>
      Stable rates act can be re-balanced in response to changes in market conditions.<br/>
      The variable rate is the rate based on the offer and demand in Aave.<br/>
      <b>- Not all tokens support stable rate</b><br/>
      <b>- Supplied token can't be borrowed with stable rate</b>
      `

    return { isActive, computeLabel, tooltipARP }
  },
})
</script>

<style></style>
