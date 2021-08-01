import { computed } from '@nuxtjs/composition-api'
import { useBigNumber } from './useBigNumber'
const { lt, gte, lte, isZero } = useBigNumber()

const colorValues = [
  { minValue: 1.0, color: 'red-dark' },
  { minValue: 0.9, color: 'red' },
  { minValue: 0.85, color: 'passion-orange' },
  { minValue: 0.8, color: 'orange' },
  { minValue: 0.75, color: 'yellow' },
  { minValue: 0.0, color: 'green-pure' },
]

const textValues = [
  { minValue: 1, text: 'Liquidate' },
  { minValue: 0.9, text: 'Very Risky' },
  { minValue: 0.75, text: 'Risky' },
  { minValue: 0, text: 'Safe' },
]

export function useStatus(statusLiquidationRatioRef, statusRef = null , liquidationRef = null) {
  const color = computed(() => {
    if (!isZero(statusRef) && !isZero(liquidationRef)) {
      if (gte(statusRef.value, '1')) return 'red-dark'
    }

    if (lte(statusLiquidationRatioRef.value, '0')) return 'grey'
    const colorValue = colorValues.find((colorValue) => gte(statusLiquidationRatioRef.value, colorValue.minValue))

    return colorValue.color
  })

  const text = computed(() => {
    if (!isZero(statusRef) && !isZero(liquidationRef)) {
      if (gte(statusRef.value, '1')) return 'Liquidate'
    }

    if (lte(statusLiquidationRatioRef.value, '0')) return 'No position'

    const textValue = textValues.find((textValue) => gte(statusLiquidationRatioRef.value, textValue.minValue))

    if (!textValue) return 'No position'

    return textValue.text
  })

  return { color, text }
}

export function getSlippageBadgeColor(value) {
  return lt(value, '0.02') ? 'green' : 'red'
}
