<template>
  <Card border-radius="rounded-xs" class="flex flex-col dark:bg-opacity-10">
    <div class="flex items-center p-4 border-b text-14 border-grey-pure border-opacity-10">
      <div class="mr-2">{{ title }}</div>
      <div><Info :text="info" /></div>
    </div>
    <div class="flex items-center p-4">
      <IconCurrency class="w-12 h-12 mr-4" :currency="tokenKey" no-height />

      <div class="flex flex-col">
        <div class="text-16">{{ totalPrice | formatUsd }}</div>
        <div class="mt-2 text-14 text-grey-pure">{{ tokenAmount }} {{ symbol }}</div>
      </div>
    </div>
  </Card>
</template>

<script>
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import { useBigNumber } from '~/composables/useBigNumber'
import { useToken } from '~/composables/useToken'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    info: {
      type: String,
      default: '',
    },
    tokenKey: {
      type: String,
      default: '',
    },
    tokenAmount: {
      type: String,
      default: '0',
    },
  },
  setup(props) {
    const { times } = useBigNumber()

    const tokenKeyRef = ref(props.tokenKey)
    const { symbol, price } = useToken(null, tokenKeyRef)
    const totalPrice = computed(() => times(price.value, props.tokenAmount).toFixed())

    return { symbol, totalPrice }
  },
})
</script>

<style></style>
