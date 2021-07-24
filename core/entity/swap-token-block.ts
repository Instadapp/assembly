//@ts-nocheck
import Protocol from '@/core/entity/protocol'

export default class SwapTokenBlock {
  constructor(data) {
    if (data) {
      this.name = 'Swap Token'
      this.type = 'swap-token'
      this.id = data.id
      this.protocol = new Protocol(data.protocol)
      this.inputAmount = Number(data.inputAmount) || 0
      this.inputTokenKey = this._setInputTokenKey(data.inputTokenKey)
      this.outputAmount = Number(data.outputAmount) || 0
      this.outputTokenKey = data.outputTokenKey
      this.slippage = Number(data.slippage) || 0
    }
  }

  _setInputTokenKey(tokenKey) {
    if (!tokenKey) {
      return this.protocol.tokenKey
    }
    return tokenKey
  }
}
