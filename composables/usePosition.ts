import { useBigNumber } from './useBigNumber'

export function usePosition() {
  const { isZero, minus, gt, lt, plus } = useBigNumber()

  function getType(position) {
    const supply = position.supply
    let borrow = position.borrow
    if (!isZero(position.borrowStable)) {
      borrow = plus(borrow, position.borrowStable)
    }

    const diff = minus(supply, borrow)

    if (isZero(diff)) return 'no'
    if (gt(diff, '0')) return 'supply'
    if (lt(diff, '0')) return 'borrow'
  }

  function translateType(type) {
    if (type === 'borrow') {
      return 'Borrowed'
    } else if (type === 'supply') {
      return 'Supplied'
    } else if (type === 'no') {
      return 'No position'
    }
  }

  return { getType, translateType }
}
