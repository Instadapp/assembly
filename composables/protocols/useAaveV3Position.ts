import { AbiItem } from "web3-utils";

import aaveV3ABI from "~/abis/read/aaveV3.json";
import uiDataProviderABI from '~/abis/read/uiProtocolDataProvider.json'
import { computed, ref, watch } from "@nuxtjs/composition-api";
import { useDSA } from "~/composables/useDSA";
import { useWeb3 } from "@instadapp/vue-web3";
import BigNumber from "bignumber.js";
import atokensV3 from "~/constant/atokensV3";
import tokens from "~/constant/tokens";
import { Multicall } from 'ethereum-multicall'
import { Network, useNetwork } from "~/composables/useNetwork";
import { useBigNumber } from "~/composables/useBigNumber";
import { usePosition } from "~/composables/usePosition";
import { useToken } from "~/composables/useToken";
import { useSorting } from "~/composables/useSorting";
import useEventBus from "../useEventBus";
import addresses from "~/constant/addresses";
import Web3 from "web3";

const {
  times,
  isZero,
  div,
  max,
  gt,
  minus,
  ensureValue,
  plus
} = useBigNumber();
const { getType } = usePosition();

export const position = ref<any>({
  totalSupplyInEth: new BigNumber(0),
  totalBorrowInEth: new BigNumber(0),
  totalSupplyInUsd: "0",
  totalBorrowInUsd: "0",
  totalBorrowStableInEth: new BigNumber(0),
  totalBorrowVariableInEth: new BigNumber(0),
  maxBorrowLimitInEth: new BigNumber(0),
  maxBorrowLiquidityLimitInEth: new BigNumber(0),
  status: new BigNumber(0),
  liquidation: new BigNumber(0),
  maxLiquidation: new BigNumber(0),
  ethPriceInUsd: new BigNumber(0),
  pendingRewards: new BigNumber(0),
  emodeId: "0",
  data: [],
});
const totalSupply = computed(() =>
  position.value
    ? times(
      position.value.totalSupplyInEth,
      position.value.ethPriceInUsd
    ).toFixed()
    : 0
);

const totalBorrow = computed(() =>
  position.value
    ? times(
      position.value.totalBorrowInEth,
      position.value.ethPriceInUsd
    ).toFixed()
    : 0
);

const ethPriceInUsd = computed(() => position.value?.ethPriceInUsd);

const annualPercentageRateTypes = computed(() => [
  { label: "Variable", value: "variable", rateMode: 2 },
  { label: "Stable", value: "stable", rateMode: 1 }
]);


async function getAaveV3TokenList(web3Instance: Web3, network: Network) {
  try {
    let rawData

    const uiDataProvider = new web3Instance.eth.Contract(uiDataProviderABI as any, addresses[network].uiData)

    try {
      rawData = await uiDataProvider.methods.getReservesData(addresses[network].poolDataProvider).call()
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
    const tokenList = { tokenData: [], aaveTokensArr: [], rawData }
    for (const x of rawData[0]) {
      const ele = atokensV3[network].allTokens.find((y) => {
        return y.address.toLowerCase() === x.aTokenAddress.toLowerCase()
      })
      if (!ele || !tokens[network].getTokenByKey(ele.root)) {
        tokenList.tokenData.push({
          root: x.symbol.toLowerCase(),
          type: 'atoken',
          symbol: `A${x.symbol}`,
          name: `AAVE ${x.symbol}`,
          address: x.aTokenAddress,
          decimals: x.decimals,
          factor: new BigNumber(x.baseLTVasCollateral).dividedBy(1e4),
          key: `a${x.symbol.toLowerCase()}`,
          underlyingAsset: x.underlyingAsset,
          supplyCap: x.supplyCap,
          borrowCap: x.borrowCap,
          availableLiquidity: new BigNumber(x.availableLiquidity).dividedBy(10 ** x.decimals),
          totalScaledVariableDebt: new BigNumber(x.totalScaledVariableDebt).dividedBy(10 ** x.decimals),
          totalPrincipalStableDebt: new BigNumber(x.totalPrincipalStableDebt).dividedBy(10 ** x.decimals),
          reserveLiquidationBonus: new BigNumber(x.reserveLiquidationBonus).dividedBy(1e4),
          eModeLiquidationThreshold: new BigNumber(x.eModeLiquidationThreshold).dividedBy(1e4),
          eModeLiquidationBonus: new BigNumber(x.eModeLiquidationBonus).dividedBy(1e4),
          eModeLtv: new BigNumber(x.eModeLtv).dividedBy(1e4),
          borrowableInIsolation: x.borrowableInIsolation,
          isolatedModeDebtCeilingInUsd: new BigNumber(x.debtCeiling).dividedBy(10 ** x.debtCeilingDecimals),
        })
      } else {
        tokenList.tokenData.push({
          ...ele,
          underlyingAsset: x.underlyingAsset,
          supplyCap: x.supplyCap,
          borrowCap: x.borrowCap,
          availableLiquidity: new BigNumber(x.availableLiquidity).dividedBy(10 ** x.decimals),
          totalScaledVariableDebt: new BigNumber(x.totalScaledVariableDebt).dividedBy(10 ** x.decimals),
          totalPrincipalStableDebt: new BigNumber(x.totalPrincipalStableDebt).dividedBy(10 ** x.decimals),
          reserveLiquidationBonus: new BigNumber(x.reserveLiquidationBonus).dividedBy(1e4),
          eModeLiquidationThreshold: new BigNumber(x.eModeLiquidationThreshold).dividedBy(1e4),
          eModeLiquidationBonus: new BigNumber(x.eModeLiquidationBonus).dividedBy(1e4),
          eModeLtv: new BigNumber(x.eModeLtv).dividedBy(1e4),
          borrowableInIsolation: x.borrowableInIsolation,
          isolatedModeDebtCeilingInUsd: new BigNumber(x.debtCeiling).dividedBy(10 ** x.debtCeilingDecimals),
        })
      }
      tokenList.aaveTokensArr.push(x.underlyingAsset)
    }

    return tokenList
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}


export function useAaveV3Position(
  { overridePosition } = { overridePosition: null }
) {
  overridePosition = overridePosition || (pos => pos);

  const { library, chainId } = useWeb3();
  const { activeNetworkId } = useNetwork();
  const { activeAccount } = useDSA();
  const { getTokenByKey, allATokensV3 } = useToken();
  const { byMaxSupplyOrBorrowDesc } = useSorting();
  const { onEvent } = useEventBus();

  const resolver = computed(
    () =>
      // @ts-ignore
      addresses[activeNetworkId.value]?.resolver?.aave_v3
  );

  const fetchPosition = async () => {
    if (!library.value) {
      return;
    }

    if (!activeAccount.value) {
      return;
    }
    const multicall = new Multicall({
      multicallCustomContractAddress: activeNetworkId.value === Network.Optimism ? '0xca11bde05977b3631167028862be2a173976ca11' : undefined,
      web3Instance: library.value,
      tryAggregate: true,
    })

    const { tokenData, aaveTokensArr, rawData } = await getAaveV3TokenList(library.value, activeNetworkId.value)

    const contractCallContext = []

    tokenData.forEach((atoken, i) => {
      contractCallContext.push(
        {
          reference: `domainSeperatorCall${i}`,
          contractAddress: atoken.address,
          abi: ['function DOMAIN_SEPARATOR() public view returns (bytes32)'],
          calls: [{ reference: `domainSeperatorCall, ${i}`, methodName: 'DOMAIN_SEPARATOR', methodParameters: [] }],
        },
        {
          reference: `userNonce${i}`,
          contractAddress: atoken.address,
          abi: ['function nonces(address owner) public view returns (uint256)'],
          calls: [{ reference: `userNonce, ${i}`, methodName: 'nonces', methodParameters: [activeAccount.value.address] }],
        },
      )
    })
    const aaveResolverInstance = new library.value.eth.Contract(
      aaveV3ABI as AbiItem[],
      resolver.value
    );

    const [aaveRawData, ethPrice] = await Promise.all([
      aaveResolverInstance.methods.getPosition(activeAccount.value.address, aaveTokensArr).call(),
      aaveResolverInstance.methods.getEthPrice().call(),

    ])

    const results = (await multicall.call(contractCallContext)).results


    const newPos = calculateAavePosition(
      aaveRawData,
      rawData,
      tokenData,
      ethPrice,
      results,
    );

    return newPos;
  };

  const refreshPosition = async () => {
    position.value = await fetchPosition();
  };

  onEvent("protocol::aaveV3::refresh", refreshPosition);

  watch(
    library,
    async val => {
      if (val) {
        refreshPosition();
      }
    },
    { immediate: true }
  );

  watch(
    activeAccount,
    async val => {
      if (val) {
        refreshPosition();
      }
    },
    { immediate: true }
  );

  const stats = computed(() =>
    displayPositions.value.reduce(
      (stats, { key, supply, borrow, priceInEth, factor, liquidation }) => {
        if (key === "eth") {
          stats.ethSupplied = supply;
        }

        stats.totalSupplyInEth = plus(
          stats.totalSupplyInEth,
          times(supply, priceInEth)
        ).toFixed();
        stats.totalBorrowInEth = plus(
          stats.totalBorrowInEth,
          times(borrow, priceInEth)
        ).toFixed();
        stats.totalMaxBorrowLimitInEth = plus(
          stats.totalMaxBorrowLimitInEth,
          times(supply, times(priceInEth, factor))
        ).toFixed();
        stats.totalMaxLiquidationLimitInEth = plus(
          stats.totalMaxLiquidationLimitInEth,
          times(supply, times(priceInEth, liquidation))
        ).toFixed();

        return stats;
      },
      {
        totalSupplyInEth: "0",
        totalBorrowInEth: "0",
        totalMaxBorrowLimitInEth: "0",
        totalMaxLiquidationLimitInEth: "0",
        ethSupplied: "0"
      }
    )
  );

  const rewardTokenPriceInUsd = computed(() => {
    if (activeNetworkId.value === Network.Polygon) {
      return ensureValue(
        position.value.data.find(position => position.key === "matic")
          ?.priceInUsd
      );
    }
    return ensureValue(
      position.value.data.find(position => position.key === "aave")?.priceInUsd
    );
  });

  const displayPositions = computed(() => {
    if (!position.value) {
      return [];
    }

    return allATokensV3.value
      .flatMap(atoken => {
        const token = getTokenByKey(atoken.root);

        const atokenPosition = position.value.data.find(
          x => x.key === atoken.root
        );

        const p = getPositionOrDefaultPosition(token, atokenPosition);

        if (gt(p.supply, "0") && gt(p.borrow, "0")) {
          return [
            { ...p, type: "supply" },
            { ...p, type: "borrow" }
          ];
        } else {
          return [p];
        }
      })
      .sort((a, b) =>
        minus(
          max(b.supplyUsd, b.borrowUsd),
          max(a.supplyUsd, a.borrowUsd)
        ).toNumber()
      )
      .map(overridePosition)
      .sort(byMaxSupplyOrBorrowDesc);
  });

  function getPositionOrDefaultPosition(token, position) {
    if (!position) {
      const defaultPosition = {
        key: token.key,
        aTokenKey: "",
        aTokenBal: "0",
        aDecimals: "0",
        cf: "0",
        ll: "0",
        supply: "0",
        supplyUsd: "0",
        supplyRate: "0",
        borrow: "0",
        borrowUsd: "0",
        borrowRate: "0",
        type: "no",
        isEnabledAsCollateral: true,
        borrowEnabled: true,
        availableLiquidity: "0",
        stableBorrowEnabled: true,
        borrowStable: "0",
        borrowStableRate: "0",
        supplyRewardRate: "0",
        borrowRewardRate: "0"
      };

      return defaultPosition;
    }

    return {
      key: token.key,
      aTokenKey: position.aTokenKey,
      aTokenBal: position.aTokenBal,
      aDecimals: position.aDecimals,
      cf: position.factor,
      ll: position.liquidation,
      factor: position.factor,
      liquidation: position.liquidation,
      supply: position.supply,
      supplyUsd: times(position.supply, position.priceInUsd).toFixed(),
      supplyRate: position.supplyRate,
      borrow: position.borrow,
      borrowUsd: times(position.borrow, position.priceInUsd).toFixed(),
      borrowRate: position.borrowRate,
      priceInEth: position.priceInEth,
      type: getType(position),
      isEnabledAsCollateral: position.isEnabledAsCollateral,
      borrowEnabled: position.borrowEnabled,
      availableLiquidity: position.availableLiquidity,
      borrowStableUsd: times(
        position.borrowStable,
        position.priceInUsd
      ).toFixed(),
      stableBorrowEnabled: position.stableBorrowEnabled,
      borrowStable: position.borrowStable,
      borrowStableRate: position.borrowStableRate,
      priceInUsd: position.priceInUsd,
      supplyRewardRate: times(
        position.supplyRewardRate,
        rewardTokenPriceInUsd.value
      ).toFixed(),
      borrowRewardRate: times(
        position.borrowRewardRate,
        rewardTokenPriceInUsd.value
      ).toFixed()
    };
  }

  const maxLiquidation = computed(() => {
    if (isZero(stats.value.totalSupplyInEth)) return "0";

    return max(
      div(
        stats.value.totalMaxLiquidationLimitInEth,
        stats.value.totalSupplyInEth
      ),
      "0"
    ).toFixed();
  });

  const liquidationPrice = computed(() => {
    if (isZero(stats.value.ethSupplied)) return "0";

    return max(
      times(
        div(
          stats.value.totalBorrowInEth,
          stats.value.totalMaxLiquidationLimitInEth
        ),
        ethPriceInUsd.value
      ),
      "0"
    ).toFixed();
  });

  const status = computed(() => {
    if (
      isZero(stats.value.totalSupplyInEth) &&
      !isZero(stats.value.totalBorrowInEth)
    )
      return "1.1";
    if (isZero(stats.value.totalSupplyInEth)) return "0";

    return max(
      div(stats.value.totalBorrowInEth, stats.value.totalSupplyInEth),
      "0"
    ).toFixed();
  });

  const liquidation = computed(() => {
    if (isZero(stats.value.totalSupplyInEth)) return "0";

    return max(
      div(stats.value.totalMaxBorrowLimitInEth, stats.value.totalSupplyInEth),
      "0"
    ).toFixed();
  });

  return {
    stats,
    displayPositions,
    position,
    fetchPosition,
    refreshPosition,
    totalSupply,
    totalBorrow,
    status,
    liquidation,
    maxLiquidation,
    liquidationPrice,
    liquidationMaxPrice: ethPriceInUsd,
    annualPercentageRateTypes
  };
}

function calculateAavePosition(res: any[], rawData: any[], tokenList: any[], ethPrice: any, multiCallResults: any) {
  console.log({
    res,
    rawData,
    tokenList,
    ethPrice,
    multiCallResults,
  })
  try {
    ethPrice = new BigNumber(ethPrice).dividedBy(1e8)

    const dataPos = []
    const AaveV3UserData = res[0]
    const [
      totalCollateralBase,
      totalBorrowsBase,
      _availableBorrowsBase,
      currentLiquidationThreshold,
      ltv,
      _healthFactor,
      eModeId,
      _base,
    ] = AaveV3UserData

    // const tokenUiData = rawData[0]
    const baseCurrencyInfo = rawData[1]

    // const [baseUnit, baseInUSD] = baseCurrencyInfo
    const [baseUnit] = baseCurrencyInfo

    const newPosition: any = {
      totalSupplyInEth: new BigNumber(0),
      totalBorrowInEth: new BigNumber(0),
      totalSupplyInUsd: new BigNumber(totalCollateralBase).dividedBy(baseUnit).toFixed(),
      totalBorrowInUsd: new BigNumber(totalBorrowsBase).dividedBy(baseUnit).toFixed(),
      totalBorrowStableInEth: new BigNumber(0),
      totalBorrowVariableInEth: new BigNumber(0),
      maxBorrowLimitInEth: new BigNumber(0),
      maxBorrowLiquidityLimitInEth: new BigNumber(0),
      status: new BigNumber(0),
      liquidation: new BigNumber(ltv).dividedBy(1e4),
      maxLiquidation: new BigNumber(currentLiquidationThreshold).dividedBy(1e4),
      ethPriceInUsd: new BigNumber(ethPrice),
      pendingRewards: new BigNumber(0),
      emodeId: eModeId,
      data: [],
      // tokens: {},
    }

    tokenList.forEach((atoken, i) => {
      /* eslint-disable no-unused-vars */
      const [
        supplyBalanceInWei,
        borrowStableBalanceInWei,
        borrowVariableBalanceInWei,
        supplyRatePerBlock,
        borrowStableRatePerBlock,
        userStableBorrowRatePerBlock,
        borrowVariableRatePerBlock,
        isCollateralEnabled,
        price,
        flag,
      ] = res[1][i]
      const [usageAsCollateralEnabled, borrowEnabled, stableBorrowEnabled, isActive, isFrozen] = flag

      const [
        asset,
        symbol,
        decimals,
        ltv,
        threshold,
        reserveFactor,
        totalSupply,
        availableLiquidity,
        totalStableDebt,
        totalVariableDebt,
        reserves,
        aaveV3Token,
        // collateralEmission,
        // debtEmission,
        // aTokenAddress,
        // stableDebtTokenAddress,
        // variableDebtTokenAddress,
      ] = res[2][i]
      /* eslint-enable no-unused-vars */

      const [aTokenAddr, sTokenAddr, vTokenAddr] = reserves

      // Reward Info: TODO
      // const rewardInfo = res[3][i]
      // const aIncentiveData = rewardInfo[1]
      // const rewardsTokenInfo = aIncentiveData.rewardsTokenInfo
      // const UserRewardInfo = {
      //   rewardTokenSymbol: rewardsTokenInfo[0],
      //   rewardTokenDecimals: rewardsTokenInfo[4],
      //   rewardTokenAddress: rewardsTokenInfo[1],
      //   userUnclaimedRewards: rewardsTokenInfo[3],
      // }

      const [, , eModeCategory] = aaveV3Token
      const root = atoken.root
      const factor = new BigNumber(ltv).dividedBy(1e4)
      const priceInUsd = new BigNumber(price).dividedBy(baseUnit).toFixed()
      const priceInEth = new BigNumber(priceInUsd).dividedBy(ethPrice)
      const supply = new BigNumber(supplyBalanceInWei).dividedBy(10 ** decimals)
      const borrowStable = new BigNumber(borrowStableBalanceInWei).dividedBy(10 ** decimals)
      const borrowVariable = new BigNumber(borrowVariableBalanceInWei).dividedBy(10 ** decimals)
      const supplyRate = new BigNumber(supplyRatePerBlock).dividedBy(1e27).toFixed()
      const supplyYield = supplyRate
      const borrowStableRate = new BigNumber(borrowStableRatePerBlock).dividedBy(1e27).toFixed()
      const userBorrowStableRate = new BigNumber(userStableBorrowRatePerBlock).dividedBy(1e27).toFixed()
      const borrowVariableRate = new BigNumber(borrowVariableRatePerBlock).dividedBy(1e27).toFixed()
      const borrowStableYield = borrowStableRate
      const borrowVariableYield = borrowVariableRate

      // const totalSupplied = new BigNumber(totalSupply).dividedBy(10 ** decimals).multipliedBy(priceInUsd)
      // const totalDebt = BigNumber.sum(BigNumber(totalVariableDebt), BigNumber(totalStableDebt))

      //   .dividedBy(10 ** decimals)
      //   .multipliedBy(priceInUsd)

      //   const supplyRewardRate = new BigNumber(collateralEmission)
      //     .multipliedBy(31536000)
      //     .dividedBy(1e18)
      //     .dividedBy(totalSupplied)
      //     .toFixed()
      //   const borrowRewardRate = new BigNumber(debtEmission)
      //     .multipliedBy(31536000)
      //     .dividedBy(1e18)
      //     .dividedBy(totalDebt)
      //     .toFixed()

      newPosition.totalSupplyInEth = newPosition.totalSupplyInEth.plus(supply.multipliedBy(priceInEth))
      newPosition.maxBorrowLimitInEth = newPosition.maxBorrowLimitInEth.plus(
        supply.multipliedBy(priceInEth).multipliedBy(factor),
      )
      newPosition.maxBorrowLiquidityLimitInEth = newPosition.maxBorrowLiquidityLimitInEth.plus(
        supply.multipliedBy(priceInEth).multipliedBy((threshold / 10000).toString()),
      )
      newPosition.totalBorrowInEth = newPosition.totalBorrowInEth.plus(
        borrowStable.plus(borrowVariable).multipliedBy(priceInEth),
      )
      newPosition.totalBorrowStableInEth = newPosition.totalBorrowStableInEth.plus(borrowStable.multipliedBy(priceInEth))
      newPosition.totalBorrowVariableInEth = newPosition.totalBorrowVariableInEth.plus(
        borrowVariable.multipliedBy(priceInEth),
      )

      dataPos.push({
        key: root,
        underlyingTokenAddress: atoken.underlyingAsset,
        aTokenAddr: aTokenAddr[0],
        stableDebtTokenAddress: sTokenAddr[0],
        variableDebtTokenAddress: vTokenAddr[0],
        aTokenBal: supplyBalanceInWei,
        aTokenKey: atoken.key,
        aDecimals: atoken.decimals.toString(),
        priceInEth: priceInEth.toFixed(),
        priceInUsd,
        liquidationBonus: new BigNumber(atoken.reserveLiquidationBonus).toString(),
        supply: supply.toFixed(),
        borrowStable: borrowStable.toFixed(),
        borrowCap: atoken.borrowCap,
        supplyCap: atoken.supplyCap,
        borrow: borrowVariable.toFixed(), // TODO: change later
        supplyRate,
        supplyYield,
        borrowStableRate,
        userBorrowStableRate,
        borrowStableYield,
        borrowRate: borrowVariableRate, // TODO: change later
        borrowYield: borrowVariableYield, // TODO: change later
        factor: factor.toFixed(),
        liquidation: (threshold / 10000).toString(),
        isEnabledAsCollateral: isCollateralEnabled,
        borrowEnabled,
        stableBorrowEnabled,
        availableLiquidity: atoken.availableLiquidity.toFixed(0),
        totalScaledVariableDebt: atoken.totalScaledVariableDebt.toFixed(0),
        totalScaledStableDebt: atoken.totalPrincipalStableDebt.toFixed(0),
        eModeCategory,
        eModeFactor: new BigNumber(atoken.eModeLtv).toString(),
        eModeLiquidation: new BigNumber(atoken.eModeLiquidationThreshold).toString(),
        eModeLiquidationBonus: new BigNumber(atoken.eModeLiquidationBonus).toString(),
        eModeLabel: atoken.eModeLabel,
        borrowableInIsolation: atoken.borrowableInIsolation,
        isIsolatedAsset: atoken.isolatedModeDebtCeilingInUsd > 0,
        isolationDebtCeiling: atoken.isolatedModeDebtCeilingInUsd,
        UserRewardInfo: {},
        domainSeperator: multiCallResults[`domainSeperatorCall${i}`].callsReturnContext[0].returnValues,
        atokenNonce: new BigNumber(multiCallResults[`userNonce${i}`].callsReturnContext[0].returnValues).toString(),
        // supplyRewardRate,
        // borrowRewardRate,
      })
    })

    const totalSupplyInEthIsZero = newPosition.totalSupplyInEth.isZero()
    const status = totalSupplyInEthIsZero ? 0 : newPosition.totalBorrowInEth.dividedBy(newPosition.totalSupplyInEth).toFixed()

    // const pendingRewards = new BigNumber(res[1].pendingRewards).dividedBy(1e18).toFixed()

    newPosition.totalSupplyInEth = newPosition.totalSupplyInEth.toFixed()
    newPosition.totalBorrowInEth = newPosition.totalBorrowInEth.toFixed()
    newPosition.maxBorrowLimitInEth = newPosition.maxBorrowLimitInEth.toFixed()
    newPosition.maxBorrowLiquidityLimitInEth = newPosition.maxBorrowLiquidityLimitInEth.toFixed()
    newPosition.totalBorrowStableInEth = newPosition.totalBorrowStableInEth.toFixed()
    newPosition.totalBorrowVariableInEth = newPosition.totalBorrowVariableInEth.toFixed()

    newPosition.status = status
    newPosition.pendingRewards = 0 // TODO = pendingRewards

    newPosition.data = dataPos

    return newPosition
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
