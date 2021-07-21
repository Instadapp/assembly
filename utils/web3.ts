import Web3 from "web3";

const mainnetInfura = "https://mainnet.infura.io/v3/";
const polygonInfura = "https://polygon-mainnet.infura.io/v3/";

export const polygonWeb3 = new Web3(
  new Web3.providers.HttpProvider(
    polygonInfura + "5c8b888909a544e2ba6917322f0cca68"
  )
);

export const mainnetWeb3 = new Web3(
  new Web3.providers.HttpProvider(
    mainnetInfura + "5c8b888909a544e2ba6917322f0cca68"
  )
);
