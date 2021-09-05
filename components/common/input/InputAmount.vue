<template>
  <div class="flex flex-col flex-shrink-0 w-full">
    <div class="relative transition-all duration-150 rounded-sm" :class="{ 'shadow-sm': !disabled }">
      <input
        autocomplete="off"
        type="text"
        inputmode="decimal"
        :value="value"
        v-bind="$attrs"
        class="w-full pl-4 rounded-[6px] transition-colors duration-75 ease-out border border-grey-dark border-opacity-[0.15]"
        :class="{
          'pr-12': !!symbol,
          'pr-8': !symbol,
          'rounded-b-none': badgeValue != null,
          'text-sm': size === 'lg',
          'bg-gray-50': backgroundColor === 'grey',
        }"
        :aria-invalid="(touched || showError) && !!error"
        :aria-describedby="id"
        :disabled="disabled"
        v-on="inputListeners"
      />

      <div v-if="!!tokenKeys && !!tokenKeys.length" class="absolute inset-y-0 right-0">
        <Dropdown class="h-full">
          <template #trigger="{ toggle }">
            <button
              v-if="!!symbol"
              class="flex items-center h-full px-1 font-semibold whitespace-no-wrap  text-ocean-blue-pure text-11 dark:text-light"
              @click="toggle"
            >
              <span class="mr-1">{{ symbol }}</span>
              <Icon name="chevron-down" class="h-3" />
            </button>
          </template>
          <template #menu="{ close }">
            <DropdownMenu>
              <button
                v-for="(tokenKey, index) in tokenKeys"
                :key="index"
                class="flex items-center w-full px-4 py-2 font-semibold  text-ocean-blue-pure text-11 dark:text-light hover:bg-opacity-50 focus:bg-opacity-50 hover:bg-grey-light dark:hover:bg-dark-300 dark:focus:bg-dark-300 focus:outline-none focus:bg-grey-light"
                @click="select(tokenKey, close)"
              >
                {{ getSymbol(tokenKey) }}
              </button>
            </DropdownMenu>
          </template>
        </Dropdown>
      </div>
      <div
        v-else-if="!!getSymbol(tokenKey)"
        class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none select-none"
      >
        <span
          class="uppercase"
          :class="{
            'text-ocean-blue-pure dark:text-light': !disabled,
            'text-grey-pure': disabled,
            'text-11': size === 'md',
            'text-14 font-medium': size === 'lg',
          }"
        >
          {{ getSymbol(tokenKey) }}
        </span>
      </div>
    </div>

    <Badge
      v-if="badgeValue != null"
      class="h-6 rounded-t-none rounded-b-sm bg-opacity-38 bg-grey-pure text-opacity-38"
      large
    >
      <SVGSpinner v-if="badgeLoading" class="animate-spin-loading" style="width: auto; height: 1em" />
      <span v-else>{{ badgeValue }}</span>
    </Badge>

    <div class="h-4">
      <transition
        enter-active-class="duration-75 ease-out"
        enter-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-75 ease-in"
        leave-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <p v-if="(touched || showError) && !!error" :id="id" class="mt-1 text-red-600 text-12">
          {{ error }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, ref, toRef, computed } from '@nuxtjs/composition-api'
import { useInputListeners } from '@/composables/useInputListeners'
import SVGSpinner from '@/assets/img/icons/spinner.svg'
import { v4 as uuid } from 'uuid'
import { useToken } from '~/composables/useToken'
import { useFormatting } from '~/composables/useFormatting'
import { usePattern } from '~/composables/usePattern'
import Dropdown from './Dropdown.vue'
import DropdownMenu from '~/components/protocols/DropdownMenu.vue'

export default defineComponent({
  inheritAttrs: false,
  components: {
    SVGSpinner,
    Dropdown,
    DropdownMenu,
  },
  props: {
    value: { type: String, default: '' },
    badgeValue: { type: String, default: null },
    badgeLoading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    showError: { type: Boolean, default: false },
    error: { type: String, default: null },
    tokenKey: { type: String, required: true },
    tokenKeys: { type: Array, default: () => null },
    size: { type: String, default: 'md' },
    backgroundColor: { type: String, default: 'white' },
  },

  setup(props, context) {
    const id = uuid()
    const { getTokenByKey } = useToken()
    const token = computed(() => getTokenByKey(props.tokenKey))
    const symbol = computed(() => token.value?.symbol)
    const { formatDecimal } = useFormatting()
    const { amountPattern } = usePattern()

    const numericFilter = (value) => amountPattern.test(value)
    const { inputListeners } = useInputListeners(props, context, numericFilter)

    const touched = ref(false)
    const stopTouchedWatcher = watch(
      () => props.value,
      () => {
        touched.value = true
        stopTouchedWatcher()
      }
    )

    function getSymbol(key) {
      return getTokenByKey(key)?.symbol || key
    }

    function select(tokenKey, cb) {
      context.emit('tokenKeyChanged', tokenKey)
      cb()
    }

    return { inputListeners, touched, symbol, formatDecimal, id, getSymbol, select }
  },
})
</script>
