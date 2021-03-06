import { createTokenUtils } from "../utils/create-token-utils";

// prettier-ignore
export default {
  mainnet: createTokenUtils([
    { key: 'eth', type: 'token', symbol: 'ETH', name: 'Ethereum', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', decimals: 18, isStableCoin: false },
    { key: 'weth', type: 'token', symbol: 'WETH', name: 'Wrapped Ethereum', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, isStableCoin: false },
    { key: 'inst', type: 'token', symbol: 'INST', name: 'Instadapp Token', address: '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb', decimals: 18, isStableCoin: false },
    { key: 'dai', type: 'token', symbol: 'DAI', name: 'DAI Stable', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18, isStableCoin: true },
    { key: 'usdc', type: 'token', symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, isStableCoin: true },
    { key: 'usdt', type: 'token', symbol: 'USDT', name: 'Tether USD Coin', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, isStableCoin: true },
    { key: 'mkr', type: 'token', symbol: 'MKR', name: 'MakerDAO', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', decimals: 18, isStableCoin: false },
    { key: 'comp', type: 'token', symbol: 'COMP', name: 'Compound', address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', decimals: 18, isStableCoin: false },
    { key: 'rai', type: 'token', symbol: 'RAI', name: 'Rai Reflex Index', address: '0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919', decimals: 18, isStableCoin: false },
    { key: 'lusd', type: 'token', symbol: 'LUSD', name: 'Liquity USD', address: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0', decimals: 18, isStableCoin: true },
    { key: 'zrx', type: 'token', symbol: 'ZRX', name: '0x Protocol', address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498', decimals: 18, isStableCoin: false },
    { key: 'rep', type: 'token', symbol: 'REP', name: 'Augur', address: '0x1985365e9f78359a9B6AD760e32412f4a445E862', decimals: 18, isStableCoin: false },
    { key: 'tusd', type: 'token', symbol: 'TUSD', name: 'TrueUSD', address: '0x0000000000085d4780B73119b644AE5ecd22b376', decimals: 18, isStableCoin: true },
    { key: 'usdp', type: 'token', symbol: 'USDP', name: 'Paxos Standard Coin', address: '0x8E870D67F660D95d5be530380D0eC0bd388289E1', decimals: 18, isStableCoin: true },
    { key: 'bat', type: 'token', symbol: 'BAT', name: 'Basic Attention', address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF', decimals: 18, isStableCoin: false },
    { key: 'knc', type: 'token', symbol: 'KNC', name: 'Kyber Network', address: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200', decimals: 18, isStableCoin: false },
    { key: 'wbtc', type: 'token', symbol: 'WBTC', name: 'Wrapped BTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, isStableCoin: false },
    { key: 'susd', type: 'token', symbol: 'SUSD', name: 'Synthetix USD', address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51', decimals: 18, isStableCoin: false },
    { key: 'sbtc', type: 'token', symbol: 'SBTC', name: 'Synthetix BTC', address: '0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6', decimals: 18, isStableCoin: false },
    { key: 'ren', type: 'token', symbol: 'REN', name: 'Republic Token', address: '0x408e41876cCCDC0F92210600ef50372656052a38', decimals: 18, isStableCoin: false },
    { key: 'renbtc', type: 'token', symbol: 'renBTC', name: 'Ren BTC', address: '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D', decimals: 8, isStableCoin: false },
    { key: 'busd', type: 'token', symbol: 'BUSD', name: 'Binance USD', address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53', decimals: 18, isStableCoin: true },
    { key: 'lend', type: 'token', symbol: 'LEND', name: 'ETH LEND', address: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03', decimals: 18, isStableCoin: false },
    { key: 'aave', type: 'token', symbol: 'AAVE', name: 'Aave Token', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', decimals: 18, isStableCoin: false },
    { key: 'link', type: 'token', symbol: 'LINK', name: 'ChainLink Token', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18, isStableCoin: false },
    { key: 'mana', type: 'token', symbol: 'MANA', name: 'Decentraland', address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942', decimals: 18, isStableCoin: false },
    { key: 'snx', type: 'token', symbol: 'SNX', name: 'Synthetix Network Token', address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', decimals: 18, isStableCoin: false },
    { key: 'uni', type: 'token', symbol: 'UNI', name: 'Uniswap Token', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, isStableCoin: false },
    { key: 'yfi', type: 'token', symbol: 'YFI', name: 'YEARN', address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', decimals: 18, isStableCoin: false },
    { key: 'lrc', type: 'token', symbol: 'LRC', name: 'Loopring Coin V2', address: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD', decimals: 18, isStableCoin: false },
    { key: 'enj', type: 'token', symbol: 'ENJ', name: 'Enjin Coin', address: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c', decimals: 18, isStableCoin: false },
    { key: 'bal', type: 'token', symbol: 'BAL', name: 'Balancer', address: '0xba100000625a3754423978a60c9317c58a424e3D', decimals: 18, isStableCoin: false },
    { key: 'gusd', type: 'token', symbol: 'GUSD', name: 'Gemini Dollar', address: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd', decimals: 2, isStableCoin: true },
    { key: 'dpi', type: 'token', symbol: 'DPI', name: 'DefiPulse Index', address: '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b', decimals: 18, isStableCoin: false },
    { key: '1inch', type: 'token', symbol: '1INCH', name: '1INCH Token', address: '0x111111111117dC0aa78b770fA6A738034120C302', decimals: 18, isStableCoin: false },
    { key: 'sushi', type: 'token', symbol: 'SUSHI', name: 'Sushiswap Token', address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', decimals: 18, isStableCoin: false },
    { key: 'xsushi', type: 'token', symbol: 'xSUSHI', name: 'Sushibar', address: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272', decimals: 18, isStableCoin: false },
    { key: 'crv', type: 'token', symbol: 'CRV', name: 'Curve DAO Token', address: '0xD533a949740bb3306d119CC777fa900bA034cd52', decimals: 18, isStableCoin: false },
    { key: 'stkaave', type: 'token', symbol: 'stkAAVE', name: 'Staked Aave', address: '0x4da27a545c0c5B758a6BA100e3a049001de870f5', decimals: 18, isStableCoin: false },
    { key: 'matic', type: 'token', symbol: 'MATIC', name: 'Matic Token', address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', decimals: 18, isStableCoin: false },
    { key: 'lqty', type: 'token', symbol: 'LQTY', name: 'Liquity Protocol', address: '0x6DEA81C8171D0bA574754EF6F8b412F2Ed88c54D', decimals: 18, isStableCoin: false },
    { key: 'ampl', type: 'token', symbol: 'AMPL', name: 'Ampleforth', address: '0xD46bA6D942050d489DBd938a2C909A5d5039A161', decimals: 9, isStableCoin: false },
    { key: 'renfil', type: 'token', symbol: 'renFIL', name: 'renFIL', address: '0xD5147bc8e386d91Cc5DBE72099DAC6C9b99276F5', decimals: 18, isStableCoin: false },
    { key: 'frax', type: 'token', symbol: 'FRAX', name: 'Frax Protocol', address: '0x853d955aCEf822Db058eb8505911ED77F175b99e', decimals: 18, isStableCoin: true },
    { key: 'fei', type: 'token', symbol: 'FEI', name: 'Fei Protocol', address: '0x956F47F50A910163D8BF957Cf5846D573E7f87CA', decimals: 18, isStableCoin: true },
    { key: 'steth', type: 'token', symbol: 'stETH', name: 'Lido stETH Token', address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', decimals: 18, isStableCoin: false },
    { key: 'wsteth', type: 'token', symbol: 'wstETH', name: 'Lido Wrapped stETH Token', address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0', decimals: 18, isStableCoin: false },
    { key: 'ape', type: 'token', symbol: 'APE', name: 'ApeCoin Token', address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381', decimals: 18, isStableCoin: false },
    { key: 'ust', type: 'token', symbol: 'UST', name: 'UST (Wormhole)', address: '0xa693B19d2931d498c5B318dF961919BB4aee87a5', decimals: 6, isStableCoin: true },
  ]),

  polygon: createTokenUtils([
    {
      key: 'matic',
      type: 'token',
      symbol: 'MATIC',
      name: 'MATIC',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'inst',
      type: 'token',
      symbol: 'INST',
      name: 'Instadapp Token',
      address: '0xf50D05A1402d0adAfA880D36050736f9f6ee7dee',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'eth',
      type: 'token',
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'dai',
      type: 'token',
      symbol: 'DAI',
      name: 'DAI Stable',
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      decimals: 18,
      isStableCoin: true,
    },
    {
      key: 'usdc',
      type: 'token',
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      decimals: 6,
      isStableCoin: true,
    },
    {
      key: 'usdt',
      type: 'token',
      symbol: 'USDT',
      name: 'Tether USD Coin',
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      decimals: 6,
      isStableCoin: true,
    },
    {
      key: 'wmatic',
      type: 'token',
      symbol: 'WMATIC',
      name: 'Wrapped MATIC',
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'wbtc',
      type: 'token',
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
      decimals: 8,
      isStableCoin: false,
    },
    {
      key: 'aave',
      type: 'token',
      symbol: 'AAVE',
      name: 'Aave Token',
      address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'sushi',
      type: 'token',
      symbol: 'SUSHI',
      name: 'Sushi Token',
      address: '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'bal',
      type: 'token',
      symbol: 'BAL',
      name: 'balancer Token',
      address: '0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'crv',
      type: 'token',
      symbol: 'CRV',
      name: 'CRV Token',
      address: '0x172370d5Cd63279eFa6d502DAB29171933a610AF',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'dpi',
      type: 'token',
      symbol: 'DPI',
      name: 'DPI Token',
      address: '0x85955046DF4668e1DD369D2DE9f3AEB98DD2A369',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'link',
      type: 'token',
      symbol: 'LINK',
      name: 'ChainLink Token',
      address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'ghst',
      type: 'token',
      symbol: 'GHST',
      name: 'Aavegotchi GHST Token',
      address: '0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'jeur',
      type: 'token',
      symbol: 'JEUR',
      name: 'Jarvis Synthetic Euro Token',
      address: '0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'eurs',
      type: 'token',
      symbol: 'EURS',
      name: 'Statis EURS Token',
      address: '0xE111178A87A3BFf0c8d18DECBa5798827539Ae99',
      decimals: 2,
      isStableCoin: false,
    },
    {
      key: 'ageur',
      type: 'token',
      symbol: 'AGEUR',
      name: 'aGEUR Token',
      address: '0xE0B52e49357Fd4DAf2c15e02058DCE6BC0057db4',
      decimals: 18,
      isStableCoin: false,
    },
  ]),

  arbitrum: createTokenUtils([
    {
      key: 'eth',
      type: 'token',
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'weth',
      type: 'token',
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'usdc',
      type: 'token',
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      decimals: 6,
      isStableCoin: true,
    },
    {
      key: 'usdt',
      type: 'token',
      symbol: 'USDT',
      name: 'Tether USD Coin',
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      decimals: 6,
      isStableCoin: true,
    },
    {
      key: 'link',
      type: 'token',
      symbol: 'LINK',
      name: 'ChainLink Token',
      address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'uni',
      type: 'token',
      symbol: 'UNI',
      name: 'Uniswap Token',
      address: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'wbtc',
      type: 'token',
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      decimals: 8,
      isStableCoin: false,
    },
    {
      key: 'dai',
      type: 'token',
      symbol: 'DAI',
      name: 'Dai Stable',
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      decimals: 18,
      isStableCoin: true,
    },
    {
      key: 'eurs',
      type: 'token',
      symbol: 'EURS',
      name: 'Statis EURS',
      address: '0xD22a58f79e9481D1a88e00c343885A588b34b68B',
      decimals: 18,
      isStableCoin: false,
    },
  ]),
  avalanche: createTokenUtils([
    {
      key: 'avax',
      type: 'token',
      symbol: 'AVAX',
      name: 'Avalanche',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'wavax',
      type: 'token',
      symbol: 'WAVAX',
      name: 'Wrapped AVAX',
      address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'eth',
      type: 'token',
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'usdte',
      type: 'token',
      symbol: 'USDT.e',
      name: 'Tether USD Coin',
      address: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
      decimals: 6,
      isStableCoin: true,
    },
    {
      key: 'usdt',
      type: 'token',
      symbol: 'USDT',
      name: 'Tether USD Coin',
      address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
      decimals: 6,
      isStableCoin: true,
    },
    {
      key: 'aave',
      type: 'token',
      symbol: 'AAVE',
      name: 'Aave Token',
      address: '0x63a72806098Bd3D9520cC43356dD78afe5D386D9',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'usdce',
      type: 'token',
      symbol: 'USDC.e',
      name: 'USD Coin',
      address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
      decimals: 6,
      isStableCoin: true,
    },
    {
      key: 'usdc',
      type: 'token',
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      decimals: 6,
      isStableCoin: true,
    },
    {
      key: 'wbtc',
      type: 'token',
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      address: '0x50b7545627a5162F82A992c33b87aDc75187B218',
      decimals: 8,
      isStableCoin: false,
    },
    {
      key: 'dai',
      type: 'token',
      symbol: 'DAI',
      name: 'DAI Stable',
      address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
      decimals: 18,
      isStableCoin: true,
    },
    {
      key: 'qi',
      type: 'token',
      symbol: 'QI',
      name: 'Benqi',
      address: '0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'link',
      type: 'token',
      symbol: 'LINK',
      name: 'Chainlink',
      address: '0x5947BB275c521040051D82396192181b413227A3',
      decimals: 18,
      isStableCoin: false,
    },
  ]),
  optimism: createTokenUtils([
    {
      key: 'eth',
      type: 'token',
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'weth',
      type: 'token',
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'usdc',
      type: 'token',
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      decimals: 6,
      isStableCoin: true,
    },
    {
      key: 'usdt',
      type: 'token',
      symbol: 'USDT',
      name: 'Tether USD Coin',
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      decimals: 6,
      isStableCoin: true,
    },
    {
      key: 'dai',
      type: 'token',
      symbol: 'DAI',
      name: 'DAI Stable',
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      decimals: 18,
      isStableCoin: true,
    },
    {
      key: 'uni',
      type: 'token',
      symbol: 'UNI',
      name: 'Uniswap Token',
      address: '0x6fd9d7AD17242c41f7131d257212c54A0e816691',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'wbtc',
      type: 'token',
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
      decimals: 8,
      isStableCoin: false,
    },
    {
      key: 'link',
      type: 'token',
      symbol: 'LINK',
      name: 'ChainLink LINK',
      address: '0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6',
      decimals: 18,
      isStableCoin: false,
    },
    {
      key: 'susd',
      type: 'token',
      symbol: 'SUSD',
      name: 'Synth SUSD',
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      decimals: 18,
      isStableCoin: true,
    },
    {
      key: 'aave',
      type: 'token',
      symbol: 'AAVE',
      name: 'AAVE',
      address: '0x76FB31fb4af56892A25e32cFC43De717950c9278',
      decimals: 18,
      isStableCoin: false,
    },
  ])
}
