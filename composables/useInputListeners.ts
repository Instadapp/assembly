import { computed } from '@vue/composition-api'
import { useBigNumber } from './useBigNumber'
const { gt } = useBigNumber()

function createEventListener(context, eventName, filter, params) {
  return function (event) {
    const input = event.target

    if (filter) {
      // filter input with input filter
      if (filter(input.value)) {
        input.oldValue = input.value
        input.oldSelectionStart = input.selectionStart
        input.oldSelectionEnd = input.selectionEnd

        if (params?.max && gt(input.value, params.max)) {
          input.value = params.max
        }

        context.emit(eventName, input.value)
      } else if (Object.prototype.hasOwnProperty.call(input, 'oldValue')) {
        input.value = input.oldValue
        // FIXME: Jumps back to old value after moving cursor
        if (input.oldSelectionStart !== null && input.oldSelectionEnd !== null) {
          input.setSelectionRange(input.oldSelectionStart, input.oldSelectionEnd)
        }
      } else {
        input.value = ''
      }
    } else {
      context.emit(eventName, input.value)
    }
  }
}

export function useInputListeners(props, context, filter, params) {
  if (!props || typeof props.value === 'undefined') {
    throw new Error(
      "No prop 'value' found. Make sure to define and add it to the input.\nAdd the prop like this:\nvalue: { type: String, required: false, default: '' }\n\nAnd the binding on the input like this:\n:value=\"value\""
    )
  }
  const inputListeners = computed(() =>
    Object.assign({}, context.listeners, {
      change: createEventListener(context, 'change', filter, params),
      input: createEventListener(context, 'input', filter, params),
      keydown: createEventListener(context, 'keydown', filter, params),
      keyup: createEventListener(context, 'keyup', filter, params),
      mousedown: createEventListener(context, 'mousedown', filter, params),
      mouseup: createEventListener(context, 'mouseup', filter, params),
      select: createEventListener(context, 'select', filter, params),
      contextmenu: createEventListener(context, 'contextmenu', filter, params),
      dro: createEventListener(context, 'dro', filter, params),
    })
  )

  return { inputListeners }
}
