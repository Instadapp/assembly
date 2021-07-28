import { AbiItem } from "web3-utils";

import aaveV2ABI from "~/abis/read/aaveV2.json";
import { computed, ref, watch } from "@nuxtjs/composition-api";
import { useDSA } from "./useDSA";
import { useWeb3 } from "./useWeb3";
import BigNumber from "bignumber.js";
import atokensV2 from "~/constant/atokensV2";
import tokens from "~/constant/tokens";
import { Network } from "./useNetwork";
import { useBigNumber } from "./useBigNumber";
import { usePosition } from "./usePosition";
import { useToken } from "./useToken";

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

const position = ref<any>({
  totalSupplyInEth: new BigNumber(0),
  totalBorrowInEth: new BigNumber(0),
  totalBorrowStableInEth: new BigNumber(0),
  totalBorrowVariableInEth: new BigNumber(0),
  maxBorrowLimitInEth: new BigNumber(0),
  maxBorrowLiquidityLimitInEth: new BigNumber(0),
  ethPriceInUsd: "0",
  data: []
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

export function useAaveV2Position(
  { overridePosition } = { overridePosition: null }
) {
  overridePosition = overridePosition || (pos => pos);

  const { web3, chainId, networkName } = useWeb3();
  const { activeAccount } = useDSA();
  const { getTokenByKey, allATokensV2 } = useToken();

  const resolver =
    chainId.value === 1
      ? "0xFb3a1D56eD56F046721B9aCa749895100754578b"
      : "0xD6E0803d0eB34af8Ea135835512D7E77960b28F1";

  const fetchPosition = async () => {
    if (!web3.value) {
      return;
    }

    if (!activeAccount.value) {
      return;
    }

    const aaveResolverInstance = new web3.value.eth.Contract(
      aaveV2ABI as AbiItem[],
      resolver
    );

    const aaveTokensArr = atokensV2[networkName.value].allTokens.map(
      a => tokens[networkName.value].getTokenByKey(a.root).address
    );

    const aaveRawData = await aaveResolverInstance.methods
      .getPosition(activeAccount.value.address, aaveTokensArr)
      .call();

    const newPos = calculateAavePosition(aaveRawData, networkName.value);

    return newPos;
  };

  watch(
    web3,
    async val => {
      if (val) {
        position.value = await fetchPosition();
      }
    },
    { immediate: true }
  );

  watch(
    activeAccount,
    async val => {
      if (val) {
        position.value = await fetchPosition();
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
    if (networkName.value === Network.Polygon) {
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

    return allATokensV2.value
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
      .map(overridePosition);
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

function calculateAavePosition(res: any[], network: Network = Network.Mainnet) {
  try {
    const newPos = {
      totalSupplyInEth: new BigNumber(0),
      totalBorrowInEth: new BigNumber(0),
      totalBorrowStableInEth: new BigNumber(0),
      totalBorrowVariableInEth: new BigNumber(0),
      maxBorrowLimitInEth: new BigNumber(0),
      maxBorrowLiquidityLimitInEth: new BigNumber(0)
      // tokens: {},
    };
    const dataPos = [];
    atokensV2[network].allTokens.forEach((atoken, i) => {
      const key = atoken.address;

      /* eslint-disable no-unused-vars */
      const [
        priceInEthInWei,
        priceInUsdInWei,
        supplyBalanceInWei,
        borrowStableBalanceInWei,
        borrowVariableBalanceInWei,
        supplyRatePerBlock,
        borrowStableRatePerBlock,
        userStableBorrowRatePerBlock,
        borrowVariableRatePerBlock,
        isCollateralEnabled,
        AaveTokenData
      ] = res[0][i];

      const [
        ltv,
        threshold,
        reserveFactor,
        usageAsCollEnabled,
        borrowEnabled,
        stableBorrowEnabled,
        isActive,
        isFrozen,
        totalSupply,
        availableLiquidity,
        totalStableDebt,
        totalVariableDebt,
        collateralEmission,
        debtEmission
      ] = AaveTokenData;
      /* eslint-enable no-unused-vars */

      const decimals = tokens[network].getTokenByKey(atoken.root).decimals;
      const root = atoken.root;
      const factor = new BigNumber(ltv).dividedBy(1e4);
      const priceInEth = new BigNumber(priceInEthInWei).dividedBy(1e18);
      const priceInUsd = new BigNumber(priceInUsdInWei)
        .dividedBy(1e18)
        .toFixed();
      const supply = new BigNumber(supplyBalanceInWei).dividedBy(
        10 ** decimals
      );
      const borrowStable = new BigNumber(borrowStableBalanceInWei).dividedBy(
        10 ** decimals
      );
      const borrowVariable = new BigNumber(
        borrowVariableBalanceInWei
      ).dividedBy(10 ** decimals);
      const supplyRate = new BigNumber(supplyRatePerBlock)
        .dividedBy(1e27)
        .toFixed();
      const supplyYield = supplyRate;
      const borrowStableRate = new BigNumber(borrowStableRatePerBlock)
        .dividedBy(1e27)
        .toFixed();
      const userBorrowStableRate = new BigNumber(userStableBorrowRatePerBlock)
        .dividedBy(1e27)
        .toFixed();
      const borrowVariableRate = new BigNumber(borrowVariableRatePerBlock)
        .dividedBy(1e27)
        .toFixed();
      const borrowStableYield = borrowStableRate;
      const borrowVariableYield = borrowVariableRate;
      const liquidity = new BigNumber(availableLiquidity)
        .dividedBy(10 ** decimals)
        .multipliedBy(0.9999)
        .toFixed();
      const totalSupplied = new BigNumber(totalSupply)
        .dividedBy(10 ** decimals)
        .multipliedBy(priceInUsd);
      const totalDebt = new BigNumber(totalVariableDebt)
        .dividedBy(10 ** decimals)
        .multipliedBy(priceInUsd);
      const supplyRewardRate = new BigNumber(collateralEmission)
        .multipliedBy(31536000)
        .dividedBy(1e18)
        .dividedBy(totalSupplied)
        .toFixed();
      const borrowRewardRate = new BigNumber(debtEmission)
        .multipliedBy(31536000)
        .dividedBy(1e18)
        .dividedBy(totalDebt)
        .toFixed();

      newPos.totalSupplyInEth = newPos.totalSupplyInEth.plus(
        supply.multipliedBy(priceInEth)
      );
      newPos.maxBorrowLimitInEth = newPos.maxBorrowLimitInEth.plus(
        supply.multipliedBy(priceInEth).multipliedBy(factor)
      );
      newPos.maxBorrowLiquidityLimitInEth = newPos.maxBorrowLiquidityLimitInEth.plus(
        supply
          .multipliedBy(priceInEth)
          .multipliedBy((threshold / 10000).toString())
      );
      newPos.totalBorrowInEth = newPos.totalBorrowInEth.plus(
        borrowStable.plus(borrowVariable).multipliedBy(priceInEth)
      );
      newPos.totalBorrowStableInEth = newPos.totalBorrowStableInEth.plus(
        borrowStable.multipliedBy(priceInEth)
      );
      newPos.totalBorrowVariableInEth = newPos.totalBorrowVariableInEth.plus(
        borrowVariable.multipliedBy(priceInEth)
      );

      dataPos.push({
        key: root,
        aTokenAddr: key,
        aTokenBal: supplyBalanceInWei,
        aTokenKey: atoken.key,
        aDecimals: atoken.decimals.toString(),
        priceInEth: priceInEth.toFixed(),
        priceInUsd,
        supply: supply.toFixed(),
        borrowStable: borrowStable.toFixed(),
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
        availableLiquidity: liquidity,
        supplyRewardRate,
        borrowRewardRate
      });
    });

    const totalSupplyInEthIsZero = newPos.totalSupplyInEth.isZero();
    const status = totalSupplyInEthIsZero
      ? 0
      : newPos.totalBorrowInEth.dividedBy(newPos.totalSupplyInEth).toFixed();
    const liquidation = totalSupplyInEthIsZero
      ? 0
      : newPos.maxBorrowLimitInEth.dividedBy(newPos.totalSupplyInEth).toFixed();
    const maxLiquidation = totalSupplyInEthIsZero
      ? 0
      : newPos.maxBorrowLiquidityLimitInEth
          .dividedBy(newPos.totalSupplyInEth)
          .toFixed();
    const ethPrice = new BigNumber(res[1].ethPriceInUsd)
      .dividedBy(1e8)
      .toFixed();
    const pendingRewards = new BigNumber(res[1].pendingRewards)
      .dividedBy(1e18)
      .toFixed();

    // @ts-ignore
    newPos.totalSupplyInEth = newPos.totalSupplyInEth.toFixed();
    // @ts-ignore
    newPos.totalBorrowInEth = newPos.totalBorrowInEth.toFixed();
    // @ts-ignore
    newPos.maxBorrowLimitInEth = newPos.maxBorrowLimitInEth.toFixed();
    // @ts-ignore
    newPos.totalBorrowStableInEth = newPos.totalBorrowStableInEth.toFixed();
    // @ts-ignore
    newPos.maxBorrowLiquidityLimitInEth = newPos.maxBorrowLiquidityLimitInEth.toFixed();
    // @ts-ignore
    newPos.totalBorrowVariableInEth = newPos.totalBorrowVariableInEth.toFixed();

    // @ts-ignore
    newPos.status = status;
    // @ts-ignore
    newPos.liquidation = liquidation;
    // @ts-ignore
    newPos.maxLiquidation = maxLiquidation;
    // @ts-ignore
    newPos.ethPriceInUsd = ethPrice;
    // @ts-ignore
    newPos.pendingRewards = pendingRewards;
    // @ts-ignore
    newPos.data = dataPos;

    return newPos;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
