import { createTokenUtils } from '../utils/create-token-utils'

// prettier-ignore
const mainnetTokens = [
  { key: 'ceth', type: 'ctoken', symbol: 'CETH', name: 'Compound ETH', address: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5', decimals: 8, factor: 0.75, root: 'eth', id: 'ETH-A' },
  { key: 'cdai', type: 'ctoken', symbol: 'CDAI', name: 'Compound DAI', address: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', decimals: 8, factor: 0.75, root: 'dai', id: 'DAI-A' },
  { key: 'cusdc', type: 'ctoken', symbol: 'CUSDC', name: 'Compound USDC', address: '0x39aa39c021dfbae8fac545936693ac917d5e7563', decimals: 8, factor: 0.75, root: 'usdc', id: 'USDC-A' },
  { key: 'cusdt', type: 'ctoken', symbol: 'CUSDT', name: 'Compound USDT', address: '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9', decimals: 8, factor: 0, root: 'usdt', id: 'USDT-A' },
  { key: 'czrx', type: 'ctoken', symbol: 'CZRX', name: 'Compound ZRX', address: '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407', decimals: 8, factor: 0.6, root: 'zrx', id: 'ZRX-A' },
  { key: 'crep', type: 'ctoken', symbol: 'CREP', name: 'Compound REP', address: '0x158079ee67fce2f58472a96584a73c7ab9ac95c1', decimals: 8, factor: 0.4, root: 'rep', id: 'REP-A' },
  { key: 'cbat', type: 'ctoken', symbol: 'CBAT', name: 'Compound BAT', address: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e', decimals: 8, factor: 0.6, root: 'bat', id: 'BAT-A' },
  { key: 'cuni', type: 'ctoken', symbol: 'CUNI', name: 'Compound UNI', address: '0x35A18000230DA775CAc24873d00Ff85BccdeD550', decimals: 8, factor: 0.6, root: 'uni', id: 'UNI-A' },
  { key: 'cwbtc', type: 'ctoken', symbol: 'CWBTC', name: 'Compound WBTC', address: '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4', decimals: 8, factor: 0.6, root: 'wbtc', id: 'WBTC-A' },
  { key: 'cwbtc', type: 'ctoken', symbol: 'CWBTC', name: 'Compound WBTC', address: '0xccF4429DB6322D5C611ee964527D42E5d685DD6a', decimals: 8, factor: 0.6, root: 'wbtc', id: 'WBTC-B' },
  { key: 'ccomp', type: 'ctoken', symbol: 'CCOMP', name: 'Compound COMP', address: '0x70e36f6BF80a52b3B46b3aF8e106CC0ed743E8e4', decimals: 8, factor: 0.6, root: 'comp', id: 'COMP-A' },
  { key: 'ctusd', type: 'ctoken', symbol: 'CTUSD', name: 'Compound TUSD', address: '0x12392F67bdf24faE0AF363c24aC620a2f67DAd86', decimals: 8, factor: 0, root: 'tusd', id: 'TUSD-A' },
  { key: 'clink', type: 'ctoken', symbol: 'CLINK', name: 'Compound LINK', address: '0xFAce851a4921ce59e912d19329929CE6da6EB0c7', decimals: 8, factor: 0, root: 'link', id: 'LINK-A' },
  { key: 'cmkr', type: 'ctoken', symbol: 'CMKR', name: 'Compound MKR', address: '0x95b4ef2869ebd94beb4eee400a99824bf5dc325b', decimals: 8, factor: 0.25, root: 'mkr', id: 'MKR-A' },
  { key: 'caave', type: 'ctoken', symbol: 'CAAVE', name: 'Compound AAVE', address: '0xe65cdb6479bac1e22340e4e755fae7e509ecd06c', decimals: 8, factor: 0.25, root: 'aave', id: 'AAVE-A' },
  { key: 'cyfi', type: 'ctoken', symbol: 'CYFI', name: 'Compound YFI', address: '0x80a2ae356fc9ef4305676f7a3e2ed04e12c33946', decimals: 8, factor: 0.25, root: 'yfi', id: 'YFI-A' },
  { key: 'csushi', type: 'ctoken', symbol: 'CSUSHI', name: 'Compound SUSHI', address: '0x4b0181102a0112a2ef11abee5563bb4a3176c9d7', decimals: 8, factor: 0.25, root: 'sushi', id: 'SUSHI-A' },
]

export default {
  mainnet: createTokenUtils(mainnetTokens),
}
