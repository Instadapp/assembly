// prettier-ignore
const safes = [
    { type: 'ETH-A', token: 'ETH', key: 'eth', ratio: 0.6666666666666666, joinAddr: '0x2D3cD7b81c93f188F3CB8aD87c8Acc73d6226e3A', addr: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', stabiltyRate: 0, price: 0, typeBytes: '0x4554482d41000000000000000000000000000000000000000000000000000000', disabled: false, safeTokenType: 'token' },
  ]

export default {
  allSafes: safes,
  types: safes.map(safe => safe.type),
  getSafeByType: type => safes.find(safe => safe.type === type)
};
