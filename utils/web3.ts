import Web3 from "web3";

const mainnetInfura = "https://mainnet.infura.io/v3/";
const polygonInfura = "https://polygon-mainnet.infura.io/v3/";

export const polygonWeb3 = new Web3(
  new Web3.providers.HttpProvider(
    polygonInfura + "19c4b8b779a343e6ac5a91f4eaf55b81"
  )
);

export const mainnetWeb3 = new Web3(
  new Web3.providers.HttpProvider(
    mainnetInfura + "19c4b8b779a343e6ac5a91f4eaf55b81"
  )
);
