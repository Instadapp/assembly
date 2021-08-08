import BigNumber from "bignumber.js";

BigNumber.config({ POW_PRECISION: 200 })

export function useBigNumber() {
  /**
   * Returns value as BigNumber if it exists and can be parsed by BigNumber,
   * otherwise returns BigNumber('0')
   * @param {*} value
   * @returns BigNumber
   */
  function ensureValue(value: BigNumber.Value) {
    if (!value) return new BigNumber("0");
    if (new BigNumber(value).isNaN()) return new BigNumber("0");

    return new BigNumber(value);
  }

  /**
   * Ensures value before convert to BigNumber
   * @param {*} value
   * @returns BigNumber
   */
  function toBN(value: BigNumber.Value) {
    return ensureValue(value);
  }

  /**
   * coerce value to boolean(uses same rules as js)
   * @param {*} val
   * @returns {boolean}
   */
  function isZero(val: BigNumber.Value) {
    return toBN(val).isZero();
  }

  /**
   * Multiply value and multiplier
   * @param {*} value
   * @param {*} multiplier
   * @returns BigNumber
   */
  function times(value: BigNumber.Value, multiplier: BigNumber.Value) {
    return toBN(value).times(toBN(multiplier));
  }

  /**
   * Divides value and divisor. Protected from NaN if no divisor
   * @param {*} value
   * @param {*} divisor
   * @returns BigNumber
   */
  function div(value: BigNumber.Value, divisor: BigNumber.Value) {
    if (isZero(divisor) || isZero(value)) return toBN("0");
    return toBN(value).div(toBN(divisor));
  }

  /**
   * subtraction values
   * @param {*} value
   * @param {*} subtractor
   * @returns BigNumber
   */
  function minus(value: BigNumber.Value, subtractor: BigNumber.Value) {
    return toBN(value).minus(toBN(subtractor));
  }

  /**
   * sum value
   * @param {*} value
   * @param {*} adder
   * @returns BigNumber
   */
  function plus(value: BigNumber.Value, adder: BigNumber.Value) {
    return toBN(value).plus(toBN(adder));
  }

  /**
   * Exponent value to power
   * @param {*} value
   * @param {*} exponent
   * @returns BigNumber
   */
  function pow(value: BigNumber.Value, exponent: BigNumber.Value) {
    return toBN(value).pow(toBN(exponent));
  }

  /**
   * Get Max from ...arguments
   * @returns BigNumber
   */
  function max(...args) {
    return BigNumber.max(...args);
  }

  /**
   * Get Min from ...arguments
   * @returns BigNumber
   */
  function min(...args: BigNumber.Value[]) {
    return BigNumber.min(...args);
  }

  /**
   * Greater then (>)
   * @param {*} value
   * @param {*} compareWith
   * @returns {boolean}
   */
  function gt(value: BigNumber.Value, compareWith: BigNumber.Value) {
    return toBN(value).gt(toBN(compareWith));
  }

  /**
   * Equal (===)
   * @param {*} value
   * @param {*} compareWith
   * @returns {boolean}
   */
  function eq(value: BigNumber.Value, compareWith: BigNumber.Value) {
    return toBN(value).eq(toBN(compareWith));
  }

  /**
   * Less then (<)
   * @param {*} value
   * @param {*} compareWith
   * @returns {boolean}
   */
  function lt(value: BigNumber.Value, compareWith: BigNumber.Value) {
    return toBN(value).lt(toBN(compareWith));
  }

  /**
   * Less then or equal (<=)
   * @param {*} value
   * @param {*} compareWith
   * @returns {boolean}
   */
  function lte(value: BigNumber.Value, compareWith: BigNumber.Value) {
    return toBN(value).lte(toBN(compareWith));
  }

  /**
   * Greater then or equal (>=)
   * @param {*} value
   * @param {*} compareWith
   * @returns {boolean}
   */
  function gte(value: BigNumber.Value, compareWith: BigNumber.Value) {
    return toBN(value).gte(toBN(compareWith));
  }

  /**
   * Checks if value is BigNumber instance
   * @param {*} value
   * @returns {boolean}
   */
  function isBigNumber(value: BigNumber.Value) {
    return BigNumber.isBigNumber(value);
  }

  /**
   *
   * @param {*} value
   * @returns {boolean}
   */
  function isNegative(value: BigNumber.Value) {
    return toBN(value).isNegative();
  }

  /**
   *
   * @param {*} value
   * @returns {boolean}
   */
  function isPositive(value: BigNumber.Value) {
    return toBN(value).isPositive();
  }

  /**
   * Return absolute value
   * @param {*} value
   * @returns BigNumber
   */
  function abs(value: BigNumber.Value) {
    return toBN(value).abs();
  }

  /**
   * Returns value multiplied by -1
   * @param {*} value
   * @returns BigNumber
   */
  function negated(value: BigNumber.Value) {
    return toBN(value).negated();
  }

  /**
   * Rounds to INT like Math.floor
   * @param {*} value
   * @returns BigNumber
   */
  function intRoundFloor(value: BigNumber.Value) {
    return toBN(value).dp(0, 3);
  }

  return {
    isZero,
    toBN,
    ensureValue,
    times,
    plus,
    pow,
    minus,
    div,
    max,
    min,
    eq,
    gt,
    lt,
    lte,
    gte,
    isBigNumber,
    isNegative,
    isPositive,
    abs,
    negated,
    intRoundFloor
  };
}
