import { nextTick, onMounted, reactive, watch } from "@nuxtjs/composition-api";
import BigNumber from "bignumber.js";
import abis from "~/constant/abis";
import addresses from "~/constant/addresses";
import tokens from "~/constant/tokens";
import uniPoolTokens from "~/constant/uniPoolTokens";
import { useDSA } from "./useDSA";
import { Network } from "./useNetwork";
import { useWeb3 } from "./useWeb3";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { mainnetWeb3, polygonWeb3 } from "~/utils/web3";
import { useToken } from "./useToken";

const balances = reactive({
  user: null,
  dsa: null
});

export function useBalances() {
  const { account, web3, networkName } = useWeb3();
  const { activeAccount } = useDSA();
  const { getTokenByKey } = useToken();

  const fetchBalances = async (refresh = false) => {
    await nextTick();

    if (!balances.user || refresh) {
      balances.user = {
        mainnet: await getBalances(account.value, Network.Mainnet, mainnetWeb3),
        polygon: await getBalances(account.value, Network.Polygon, polygonWeb3)
      };
    }

    if (!balances.dsa || refresh) {
      balances.dsa = {
        mainnet: await getBalances(
          activeAccount.value.address,
          Network.Mainnet,
          mainnetWeb3
        ),
        polygon: await getBalances(
          activeAccount.value.address,
          Network.Polygon,
          polygonWeb3
        )
      };
    }
  };

  const getBalanceByKey = (tokenKey, network = null) => {
    return (
      balances.dsa?.[network || networkName.value][
        getTokenByKey(tokenKey)?.address
      ]?.balance || "0"
    );
  };

  const getBalanceRawByKey = (tokenKey, network = null) => {
    return (
      balances.dsa?.[network || networkName.value][
        getTokenByKey(tokenKey)?.address
      ]?.raw || "0"
    );
  };
  
  return {
    balances,
    fetchBalances,
    getBalanceByKey,
    getBalanceRawByKey
  };
}

async function getBalances(
  owner,
  network: Network,
  web3: Web3,
  additionalTokens = []
) {
  try {
    const tokenResolverABI = abis.resolver.balance;
    const tokenResolverAddr = addresses[network].resolver.balance;

    const tokensArr = tokens[network].allTokens;
    const tokensList =
      network === Network.Mainnet
        ? [...tokensArr, ...uniPoolTokens[network].allTokens]
        : tokensArr;

    let tokensAddrArr = tokensList.map(a => a.address);
    const tokenResolverInstance = new web3.eth.Contract(
      tokenResolverABI as AbiItem[],
      tokenResolverAddr
    );

    const tokensAddrArrLength = tokensAddrArr.length;
    let additionalTokensInfo;
    let isNotTokens;
    if (additionalTokens && additionalTokens.length) {
      additionalTokens = additionalTokens.filter(
        token =>
          !tokensArr.find(a => a.address.toLowerCase() === token.toLowerCase())
      );
    }
    if (additionalTokens && additionalTokens.length) {
      additionalTokensInfo = await getTokensDetails(
        additionalTokens,
        network,
        web3
      );
      isNotTokens = Object.fromEntries(
        additionalTokens
          .filter((val, index) => !additionalTokensInfo[index].isToken)
          .map(val => [val, { isToken: false }])
      );
      additionalTokens = additionalTokens.filter(
        (val, index) => additionalTokensInfo[index].isToken
      );
      additionalTokensInfo = additionalTokensInfo.filter(val => val.isToken);
      tokensAddrArr = tokensAddrArr.concat(additionalTokens);
    }

    const tokenBalances = await tokenResolverInstance.methods
      .getBalances(owner, tokensAddrArr)
      .call();

    let tokensBalObj = {};
    tokenBalances.forEach((a, i) => {
      const tokenAddress = web3.utils.toChecksumAddress(tokensAddrArr[i]);
      let tokenData;
      if (i < tokensAddrArrLength) {
        tokenData = {
          ...tokensList[i],
          decimals: tokensList[i].decimals.toString()
        };
      } else {
        tokenData = additionalTokensInfo[i - tokensAddrArrLength];
      }
      const { name, symbol, decimals, type, isStableCoin, key } = tokenData;
      tokensBalObj[tokenAddress] = {
        name,
        symbol,
        decimals,
        type,
        isStableCoin,
        key,
        balance: new BigNumber(a).dividedBy(10 ** tokenData.decimals).toFixed(),
        raw: String(a)
      };
    });
    tokensBalObj = { ...tokensBalObj, ...isNotTokens };

    return tokensBalObj;
  } catch (error) {
    return Promise.reject(error);
  }
}

const storedTokens = {};

async function getTokensDetails(addressArr, network: Network, web3: Web3) {
  try {
    const balanceInstance = new web3.eth.Contract(
      abis.resolver.balance as AbiItem[],
      addresses[network].resolver.balance
    );

    const result = [];
    for (let i = 0; i < addressArr.length; i++) {
      let details = tokens[network].getTokenByAddress(addressArr[i]);
      if (!details) {
        details = uniPoolTokens[network].getTokenByAddress(addressArr[i]);
      }
      if (!details) {
        details = storedTokens[addressArr[i]];
      } else {
        details.isToken = true;
      }
      try {
        if (!details) {
          details = await balanceInstance.methods
            .getTokenDetails([addressArr[i]])
            .call();
          const { name, symbol, decimals, isToken } = details[0];
          details = {
            name,
            symbol,
            decimals,
            isToken,
            type: "token",
            isStableCoin: false,
            key: symbol.toLowerCase()
          };
          storedTokens[addressArr[i]] = details;
        }
      } catch (error) {
        if (
          error.message &&
          error.message === "Returned error: execution reverted"
        ) {
          details = { isToken: false };
        } else {
          throw error;
        }
      }
      details.address = addressArr[i];
      result[i] = details;
    }
    return result;
  } catch (error) {}
}
