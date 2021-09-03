import {
  computed,
  reactive,
  onMounted,
  useContext,
  watch
} from "@nuxtjs/composition-api";
import BigNumber from "bignumber.js";
import abis from "~/constant/abis";
import addresses from "~/constant/addresses";
import tokens from "~/constant/tokens";
import uniPoolTokens from "~/constant/uniPoolTokens";
import { useDSA } from "./useDSA";
import { Network, useNetwork } from "./useNetwork";
import { useWeb3 } from "@instadapp/vue-web3";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { useToken } from "./useToken";
import { useBigNumber } from "./useBigNumber";
import { useSorting } from "./useSorting";

const balances = reactive({
  user: null,
  dsa: null
});

const prices = reactive({
  mainnet: {},
  polygon: {}
});

export function useBalances() {
  const { $axios } = useContext();
  const { times, plus, ensureValue } = useBigNumber();
  const { account, library } = useWeb3();
  const { activeNetworkId } = useNetwork()
  const { activeAccount } = useDSA();
  const { getTokenByKey } = useToken();
  const { by } = useSorting();

  onMounted(async () => {
    prices.mainnet = await $axios.$get("https://api.instadapp.io/defi/prices");
    prices.polygon = await $axios.$get(
      "https://api.instadapp.io/defi/polygon/prices"
    );
  });
  const fetchBalances = async (refresh = false) => {
    if (!balances.user || refresh) {
      if (!account.value) return;
      balances.user = {
        mainnet:
          activeNetworkId.value === Network.Mainnet
            ? await getBalances(account.value, Network.Mainnet, library.value)
            : {},
        polygon:
          activeNetworkId.value === Network.Polygon
            ? await getBalances(account.value, Network.Polygon, library.value)
            : {}
      };
    }

    if (!balances.dsa || refresh) {
      if (!activeAccount.value) return;

      balances.dsa = {
        mainnet:
          activeNetworkId.value === Network.Mainnet
            ? await getBalances(
                activeAccount.value.address,
                Network.Mainnet,
                library.value
              )
            : {},
        polygon:
          activeNetworkId.value === Network.Polygon
            ? await getBalances(
                activeAccount.value.address,
                Network.Polygon,
                library.value
              )
            : {}
      };
    }
  };

  const getBalanceByKey = (tokenKey, network = null, type = "dsa") => {
    return getBalanceByAddress(getTokenByKey(tokenKey)?.address, network, type);
  };

  const getBalanceByAddress = (address, network = null, type = "dsa") => {
    return (
      balances[type]?.[network || activeNetworkId.value][address]?.balance || "0"
    );
  };

  const getBalanceRawByKey = (tokenKey, network = null, type = "dsa") => {
    return (
      balances[type]?.[network || activeNetworkId.value][
        getTokenByKey(tokenKey)?.address
      ]?.raw || "0"
    );
  };

  const netWorth = (address, type = "dsa") => {
    const balance = getBalanceByAddress(address, activeNetworkId.value, type);
    const price = ensureValue(prices[activeNetworkId.value][address]).toFixed();

    return times(balance, price).toFixed();
  };

  const balanceTotal = computed(() =>
    tokens[activeNetworkId.value].allTokens.reduce(
      (totalNetWorth, token) =>
        plus(totalNetWorth, netWorth(token.address)).toFixed(),
      "0"
    )
  );

  const getAssets = (type = "dsa") => {
    return tokens[activeNetworkId.value].allTokens
      .map(token => ({
        ...token,
        balance: getBalanceByAddress(token.address, activeNetworkId.value, type),
        netWorth: netWorth(token.address, type)
      }))
      .sort(by("-netWorth"));
  };

  watch(library, () => {
    fetchBalances(true);
  });
  return {
    balances,
    fetchBalances,
    getBalanceByKey,
    getBalanceRawByKey,
    balanceTotal,
    prices,
    getAssets
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
