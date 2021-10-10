import aaveABI from "./abi/read/aave.json";
import aaveV2ABI from "./abi/read/aaveV2.json";
import accountsABI from "./abi/read/accounts.json";
import balanceABI from "./abi/read/balance.json";
import compoundABI from "./abi/read/compound.json";
import makerABI from "./abi/read/maker.json";
import makerProxyRegistryABI from "./abi/makerProxyRegistry.json";
import unipoolABI from "./abi/read/unipool.json";
import liquityABI from "./abi/read/liquity.json";
import reflexerABI from './abi/read/reflexer.json';
import bprotocolABI from './abi/read/bprotocol.json';

const abis = {
  makerProxyRegistry: makerProxyRegistryABI,
  resolver: {
    aave: aaveABI,
    aave_v2: aaveV2ABI,
    accounts: accountsABI,
    balance: balanceABI,
    compound: compoundABI,
    maker: makerABI,
    unipool: unipoolABI,
    liquity: liquityABI,
    reflexer: reflexerABI,
    bprotocol: bprotocolABI,
  }
};

export default abis;
