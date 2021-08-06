const idToToken = {
  'ETH-A': 'eth',
  'BAT-A': 'bat',
  'COMP-A': 'comp',
  'DAI-A': 'dai',
  'REP-A': 'rep',
  'UNI-A': 'uni',
  'USDC-A': 'usdc',
  'USDT-A': 'usdt',
  'WBTC-A': 'wbtc',
  'WBTC-B': 'wbtc',
  'ZRX-A': 'zrx',
  'TUSD-A': 'tusd',
  'LINK-A': 'link',
}

const tokenToId = {
  compound: {
    eth: 'ETH-A',
    bat: 'BAT-A',
    comp: 'COMP-A',
    dai: 'DAI-A',
    rep: 'REP-A',
    uni: 'UNI-A',
    usdc: 'USDC-A',
    usdt: 'USDT-A',
    wbtc: 'WBTC-B',
    zrx: 'ZRX-A',
    tusd: 'TUSD-A',
    link: 'LINK-A',
  },
}

const archived = {
  compound: ['WBTC-A'],
}

export default { idToToken, tokenToId, archived }
