<template>
  <Dropdown>
    <template #trigger="{ toggle }">
      <Button
        :disabled="disabled"
        color="grey"
        class="flex px-3 py-1"
        :class="{ 'pointer-events-none': disabled }"
        :style="{ background: disabled ? 'none' : '' }"
        @click="toggle"
      >
        <div class="flex flex-col items-center">
          <IconCurrency :currency="tokenKey" />
          <div
            class="mt-2 font-semibold text-center text-11"
            :class="{
              'dark:text-grey-pure': disabled,
            }"
          >
            {{ label }}
          </div>
        </div>
      </Button>
    </template>

    <template #menu="{ close }">
      <DropdownMenu class="px-1 max-h-60">
        <span v-if="!tokens.length" class="font-medium whitespace-no-wrap">No tokens available!</span>
        <div v-else class="flex flex-col overflow-x-hidden overflow-y-auto scrollbar-hover' pl-1 space-y-2 scrollbar">
          <Button
            v-for="(tokenKey, index) in tokens"
            :key="index"
            color="grey"
            class="py-2 pl-2 pr-4 mr-1"
            @click="select(tokenKey, close)"
          >
            <TokenSelectOption :token-key="tokenKey" class="w-full" />
          </Button>
        </div>
      </DropdownMenu>
    </template>
  </Dropdown>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useToken } from '~/composables/useToken'
import DropdownMenu from '~/components/protocols/DropdownMenu.vue'
import Dropdown from './common/input/Dropdown.vue'

export default defineComponent({
  components: {
    DropdownMenu,
    Dropdown
  },
  model: {
    prop: 'tokenKey',
    event: 'change',
  },
  props: {
    tokenKey: { type: String, default: null },
    tokens: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const { getTokenByKey } = useToken()
    const token = computed(() => getTokenByKey(props.tokenKey))
    const label = computed(() => (props.disabled ? token.value?.symbol : 'Change'))
    function select(tokenKey, callback) {
      emit('change', tokenKey)
      callback()
    }
    return { select, label }
  },
})
</script>
