const addresses = {
  mainnet: {
    makerProxyRegistry: "0x4678f0a6958e4D2Bc4F1BAF7Bc52E8F3564f3fE4",
    bprotocolBamm: "0x0d3AbAA7E088C2c82f54B2f47613DA438ea8C598",
    resolver: {
      aave: "0xA6Dc31dC10f8071c02099B05B76Ba15dfcD2B04c",
      aave_v2: "0xF0317C5Bc206F2291dd2f3eE9C4cDB5Bbb25418d",
      accounts: "0x621AD080ad3B839e7b19e040C77F05213AB71524",
      balance: "0xea426ed5d09d22e46e5d93176c6c7531638f15c1",
      compound: "0xcCAa4b1b3931749b8b6EF19C6b0B2c496703321b",
      maker: "0x84addce4fac0b6ee4b0cd132120d6d4b700e35c0",
      unipool: "0x22bddA39D14eD0aafeee36B6e784602fdDE64723",
      liquity: "0xDAf2A39503463B0F41f899EDD82213b3c96b6Cf8",
      reflexer: "0x016ca8d0993d1a7073b01802a2e22fd0df7e633a",
      bprotocol: "0x3843019c19259117ed473947007bcafc5c0c7129",
      yearnV2: "0x3f6DCA8a0b7d04737BC3B2aEAbeB1C09431581f0",
      universe: "0xa7963898453c00b61cff8ce7e5b28c4e8bf1348f"
    },
    uiData: undefined,
    poolDataProvider: undefined,
  },

  polygon: {
    core: {
      instaIndex: "0xA9B99766E6C676Cf1975c0D3166F96C0848fF5ad",
      instaConnectorsV2: "0x2A00684bFAb9717C21271E0751BCcb7d2D763c88"
    },
    resolver: {
      aave_v2: "0x1f5e200493adB54FEB4a7D734E48649143ecE2CA",
      aave_v3: '0x7cdBD859f2EDA545289378112FD991571d6eb73e',
      accounts: "0xdF19Da523DA64bBE82eE0E4DFf00d676A8386474",
      balance: "0x04F8a41be023f839E709eeEaA0725FD766139A4d",
      merkleResolver: {
        aave_v2: "0x2a26228e607ffD2aB2bD3aA49cBae0eDC6469Bf8"
      },
      weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    },
    uiData: '0x8F1AD487C9413d7e81aB5B4E88B024Ae3b5637D0',
    poolDataProvider: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
  },
  arbitrum: {
    core: {
      instaIndex: '0x1eE00C305C51Ff3bE60162456A9B533C07cD9288',
      instaConnectorsV2: '0x67fCE99Dd6d8d659eea2a1ac1b8881c57eb6592B'
    },
    resolver: {
      accounts: '0xdF19Da523DA64bBE82eE0E4DFf00d676A8386474',
      balance: '0x29572b16D306acd7ca0CBCA0F08C3EFF131fFDA5',
      aave_v3: '0x7cdBD859f2EDA545289378112FD991571d6eb73e',
      uniswap_v3: '0x04F8a41be023f839E709eeEaA0725FD766139A4d',
      // uniswap_v3_staker: '0x1a96af80ED8753a77E23074De78480675049A3c9',
      nonfungiblePositionManager: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    },
    uniswapV3Staker: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
    uiData: '0x3f960bB91e85Ae2dB561BDd01B515C5A5c65802b',
    poolDataProvider: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
  },
  avalanche: {
    core: {
      instaIndex: '0x6CE3e607C808b4f4C26B7F6aDAeB619e49CAbb25',
      instaConnectorsV2: '0x127d8cD0E2b2E0366D522DeA53A787bfE9002C14'
    },
    resolver: {
      aave_v2: '0x43c51C24b49f7cF389D043e93533E5179870Eea3',
      aave_v3: '0x7cdBD859f2EDA545289378112FD991571d6eb73e',
      accounts: '0x746e318e179CB0A359C1FeE8331A3F9bE309b3CE',
      balance: '0xE6F92a3eCAa618FC5D4Bf2a14090787715C115F0',
    },
    uiData: '0xdBbFaFC45983B4659E368a3025b81f69Ab6E5093',
    poolDataProvider: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
  },
  optimism: {
    core: {
      instaIndex: '0x6CE3e607C808b4f4C26B7F6aDAeB619e49CAbb25',
      instaConnectorsV2: '0x127d8cD0E2b2E0366D522DeA53A787bfE9002C14',
    },
    resolver: {
      accounts: '0x313FE505ad3ead0D35dD5d6687FB9C6B2469Db3d',
      aave_v3: '0x7cdBD859f2EDA545289378112FD991571d6eb73e',
      balance: '0xca5f37e6D8bB24c5A7958d5eccE7Bd9Aacc944f2',
    },
    uiData: '0x64f558d4BFC1c03a8c8B2ff84976fF04c762b51f',
    poolDataProvider: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
  },
};

export default addresses;
