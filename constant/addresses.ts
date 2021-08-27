const addresses = {
  mainnet: {
    makerProxyRegistry: "0x4678f0a6958e4D2Bc4F1BAF7Bc52E8F3564f3fE4",
    resolver: {
      aave: "0xA6Dc31dC10f8071c02099B05B76Ba15dfcD2B04c",
      aave_v2: "0xFb3a1D56eD56F046721B9aCa749895100754578b",
      accounts: "0x621AD080ad3B839e7b19e040C77F05213AB71524",
      balance: "0xea426ed5d09d22e46e5d93176c6c7531638f15c1",
      compound: "0xcCAa4b1b3931749b8b6EF19C6b0B2c496703321b",
      maker: "0x84addce4fac0b6ee4b0cd132120d6d4b700e35c0",
      unipool: "0x22bddA39D14eD0aafeee36B6e784602fdDE64723",
      liquity: "0xDAf2A39503463B0F41f899EDD82213b3c96b6Cf8",
      reflexer: "0x016ca8d0993d1a7073b01802a2e22fd0df7e633a"
    }
  },

  polygon: {
    core: {
      instaIndex: "0xA9B99766E6C676Cf1975c0D3166F96C0848fF5ad",
      instaConnectorsV2: "0x2A00684bFAb9717C21271E0751BCcb7d2D763c88"
    },
    resolver: {
      aave_v2: "0xD6E0803d0eB34af8Ea135835512D7E77960b28F1",
      accounts: "0xdF19Da523DA64bBE82eE0E4DFf00d676A8386474",
      balance: "0x04F8a41be023f839E709eeEaA0725FD766139A4d",
      merkleResolver: {
        aave_v2: "0x2a26228e607ffD2aB2bD3aA49cBae0eDC6469Bf8"
      },
      weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    }
  }
};

export default addresses;
