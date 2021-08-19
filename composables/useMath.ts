import { useBigNumber } from './useBigNumber'

const { pow, div, toBN, lt, isZero } = useBigNumber()

export function useMath() {
  // Convert bigNumber in string (use to save us from big number error on web3)
  // TODO - start using big number library for it?
  function bigNumInString(x) {
    if (Math.abs(x) < 1.0) {
      const e = parseInt(x.toString().split('e-')[1])
      if (e) {
        x *= Math.pow(10, e - 1)
        x = '0.' + new Array(e).join('0') + x.toString().substring(2)
      }
    } else {
      let e = parseInt(x.toString().split('+')[1])
      if (e > 20) {
        e -= 20
        x /= Math.pow(10, e)
        x += new Array(e + 1).join('0')
      }
    }
    return x
  }

  // Use to convert large decimal into small. Eg:- number 321.242312 with power 3 = 321.242
  function cleanDecimal(num, power) {
    let MUL_DIV = 100
    if (power || power === 0) {
      MUL_DIV = 10 ** power
    } else {
      if (num < 0.01) MUL_DIV = 10 ** 6
      if (num < 1) MUL_DIV = 10 ** 4
    }
    return Math.floor(Number(num) * MUL_DIV) / MUL_DIV
  }

  function roundDecimals(value) {
    if (isZero(value)) return 0.0
    if (lt(value, '0.001')) return cleanDecimal(toBN(value).toNumber(), 6)
    if (lt(value, '0.01')) return cleanDecimal(toBN(value).toNumber(), 5)
    if (lt(value, '0.1')) return cleanDecimal(toBN(value).toNumber(), 4)
    if (lt(value, '1')) return cleanDecimal(toBN(value).toNumber(), 3)
    return cleanDecimal(toBN(value).toNumber(), 3)
  }

  function divWithDec(num, power) {
    power = typeof power !== 'undefined' ? power : 0
    const divider = pow('10', power)
    return div(num, divider).toFixed()
  }

  /**
   * Checks divisor for 0. Returns 0 instead of NaN.
   *
   * @param {number} divident Divident.
   * @param {number} divisor Divisor.
   */
  function safeDivide(divident, divisor) {
    if (!divisor) return 0

    return divident / divisor
  }

  return { bigNumInString, divWithDec, cleanDecimal, safeDivide, roundDecimals }
}
