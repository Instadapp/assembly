const addresses = {
  mainnet: {
    makerProxyRegistry: "0x4678f0a6958e4D2Bc4F1BAF7Bc52E8F3564f3fE4",
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
      yearnV2: "0x3f6DCA8a0b7d04737BC3B2aEAbeB1C09431581f0"
    }
  },

  polygon: {
    core: {
      instaIndex: "0xA9B99766E6C676Cf1975c0D3166F96C0848fF5ad",
      instaConnectorsV2: "0x2A00684bFAb9717C21271E0751BCcb7d2D763c88"
    },
    resolver: {
      aave_v2: "0x1f5e200493adB54FEB4a7D734E48649143ecE2CA",
      accounts: "0xdF19Da523DA64bBE82eE0E4DFf00d676A8386474",
      balance: "0x04F8a41be023f839E709eeEaA0725FD766139A4d",
      merkleResolver: {
        aave_v2: "0x2a26228e607ffD2aB2bD3aA49cBae0eDC6469Bf8"
      },
      weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    }
  },
  arbitrum: {
    core: {
      instaIndex: '0x1eE00C305C51Ff3bE60162456A9B533C07cD9288',
      instaConnectorsV2: '0x67fCE99Dd6d8d659eea2a1ac1b8881c57eb6592B'
    },
    resolver: {
      accounts: '0xdF19Da523DA64bBE82eE0E4DFf00d676A8386474',
      balance: '0x29572b16D306acd7ca0CBCA0F08C3EFF131fFDA5',
      uniswap_v3: '0x04F8a41be023f839E709eeEaA0725FD766139A4d',
      // uniswap_v3_staker: '0x1a96af80ED8753a77E23074De78480675049A3c9',
      nonfungiblePositionManager: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    },
    uniswapV3Staker: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
  },
  avalanche: {
    core: {
      instaIndex: '0x6CE3e607C808b4f4C26B7F6aDAeB619e49CAbb25',
      instaConnectorsV2: '0x127d8cD0E2b2E0366D522DeA53A787bfE9002C14'
    },
    resolver: {
      aave_v2: '0x43c51C24b49f7cF389D043e93533E5179870Eea3',
      accounts: '0x746e318e179CB0A359C1FeE8331A3F9bE309b3CE',
      balance: '0xE6F92a3eCAa618FC5D4Bf2a14090787715C115F0',
    },
  },
};

export default addresses;
