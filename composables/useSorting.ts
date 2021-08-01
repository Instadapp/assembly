import { useBigNumber } from './useBigNumber'

export function useSorting() {
  const { times, minus, max } = useBigNumber()

  /**
   * Return a sorting function for the specified parameter.
   *
   * @param {string} sorting Property key for sorting. Prefix with `-` to sort descending.
   * Property value should be Number or Number in String representation
   */
  function by(sorting) {
    if (sorting.startsWith('-')) {
      return (a, b) => minus(b[sorting.substr(1)], a[sorting.substr(1)]).toNumber()
    } else {
      return (a, b) => minus(a[sorting], b[sorting]).toNumber()
    }
  }

  return {
    by,
    byMaxSupplyOrBorrowDesc: (a, b) => minus(max(b.supplyUsd, b.borrowUsd), max(a.supplyUsd, a.borrowUsd)).toNumber(),
    byNetWorthVaultDesc: (a, b) =>
      minus(minus(times(b.col, b.price), b.debt), minus(times(a.col, a.price), a.debt)).toNumber(),
    byTotalSupply: (a, b) => minus(b.poolTokenUsd, a.poolTokenUsd).toNumber(),
  }
}
