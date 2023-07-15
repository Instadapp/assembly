import { createTokenUtils } from '../../utils'

export default createTokenUtils([
  {
    key: 'adai',
    type: 'atoken',
    symbol: 'ADAI',
    name: 'Aave DAI',
    address: '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE',
    decimals: 18,
    factor: 0.75,
    root: 'dai',
  },
  {
    key: 'alink',
    type: 'atoken',
    symbol: 'ALINK',
    name: 'Aave LINK',
    address: '0x191c10Aa4AF7C30e871E70C95dB0E4eb77237530',
    decimals: 18,
    factor: 0.5,
    root: 'link',
  },
  {
    key: 'aeth',
    type: 'atoken',
    symbol: 'AETH',
    name: 'Aave ETH',
    address: '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8',
    decimals: 18,
    factor: 0.8,
    root: 'eth',
  },
  {
    key: 'ausdc',
    type: 'atoken',
    symbol: 'AUSDC',
    name: 'Aave USDC',
    address: '0x625E7708f30cA75bfd92586e17077590C60eb4cD',
    decimals: 6,
    factor: 0.825,
    root: 'usdc',
  },
  // {
  //   key: 'ausdt',
  //   type: 'atoken',
  //   symbol: 'AUSDT',
  //   name: 'Aave USDT',
  //   address: '0x6ab707Aca953eDAeFBc4fD23bA73294241490620',
  //   decimals: 6,
  //   factor: 0,
  //   root: 'usdt',
  // },
  {
    key: 'awbtc',
    type: 'atoken',
    symbol: 'AWBTC',
    name: 'Aave WBTC',
    address: '0x078f358208685046a11C85e8ad32895DED33A249',
    decimals: 8,
    factor: 0.7,
    root: 'wbtc',
  },
  {
    key: 'aaave',
    type: 'atoken',
    symbol: 'AAAVE',
    name: 'Aave AAVE',
    address: '0xf329e36C7bF6E5E86ce2150875a84Ce77f477375',
    decimals: 18,
    factor: 0.6,
    root: 'aave',
  },
  {
    key: 'aftm',
    type: 'atoken',
    symbol: 'AFTM',
    name: 'Aave FTM',
    address: '0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97',
    decimals: 18,
    factor: 0.25,
    root: 'ftm',
  },
  {
    key: 'asushi',
    type: 'atoken',
    symbol: 'ASUSHI',
    name: 'Aave SUSHI',
    address: '0xc45A479877e1e9Dfe9FcD4056c699575a1045dAA',
    decimals: 18,
    factor: 0.2,
    root: 'sushi',
  },
  {
    key: 'acrv',
    type: 'atoken',
    symbol: 'ACRV',
    name: 'Aave CRV',
    address: '0x513c7E3a9c69cA3e22550eF58AC1C0088e918FFf',
    decimals: 18,
    factor: 0.75,
    root: 'crv',
  },
  {
    key: 'afusdt',
    type: 'atoken',
    symbol: 'AFUSDT',
    name: 'Aave FUSDT',
    address: '0x6ab707Aca953eDAeFBc4fD23bA73294241490620',
    decimals: 6,
    factor: 0.75,
    root: 'fusdt',
  },
])