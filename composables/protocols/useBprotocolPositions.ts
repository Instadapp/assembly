import { computed, Ref, ref, watch } from "@nuxtjs/composition-api";
import { useBalances } from "../useBalances";
import { useBigNumber } from "../useBigNumber";
import { useToken } from "../useToken";
import { useWeb3 } from "@instadapp/vue-web3";
import { AbiItem } from "web3-utils";
import BigNumber from "bignumber.js";
BigNumber.config({ POW_PRECISION: 200 });
import abis from "~/constant/abis";
import addresses from "~/constant/addresses";
import { useDSA } from "../useDSA";
import useEventBus from "../useEventBus";

export const userData = ref<any>({
  bammTotalSupply: "0",
  bammUserBalance: "0",
  ethTotal: "0",
  ethUserBalance: "0",
  lusdPrice: "0",
  lusdTotal: "0",  
  lusdUserBalance: "0",
  unclaimedLqty: "0"
});

const fromWei = (n) => new BigNumber(n).dividedBy(1e18).toString();
const toWei = (n) => new BigNumber(n).multipliedBy(1e18).toString();

export function useBprotocolPosition (){
  const { activeAccount } = useDSA();
  const { library } = useWeb3();
  const { onEvent } = useEventBus()
  const { getTokenByKey } = useToken();

  const bammToken = computed(() => getTokenByKey('lusd'))
  const ethPrice = computed(() => fromWei(userData.value.lusdPrice)) // wrong mapping
  const bammTotalSupply = computed(() => fromWei(userData.value.bammTotalSupply));
  const bammUserBalance = computed(() => fromWei(userData.value.bammUserBalance));
  const ethTotal = computed(() => fromWei(userData.value.ethTotal));
  const ethUserBalance = computed(() => fromWei(userData.value.ethUserBalance));
  const lusdTotal = computed(() => fromWei(userData.value.lusdTotal));
  const lusdUserBalance = computed(() => fromWei(userData.value.lusdUserBalance));
  const unclaimedLqty = computed(() => fromWei(userData.value.unclaimedLqty));
  const userBammInUsd = computed(() => {
    if(userData.value.bammTotalSupply === "0"){
      return "0"
    }
    const userEthInUsd = new BigNumber(userData.value.ethUserBalance).multipliedBy(ethPrice.value)
    return fromWei(userEthInUsd.plus(userData.value.lusdUserBalance))
  });
  const totalBammSupplyInUsd = computed(() => {
    if(userData.value.bammTotalSupply === "0"){
      return "0"
    }
    const userEthInUsd = new BigNumber(userData.value.ethTotal).multipliedBy(ethPrice.value)
    return fromWei(userEthInUsd.plus(userData.value.lusdTotal))
  });
  const userBammInLusd = computed(() => {
    if(userData.value.bammTotalSupply === "0"){
      return "0"
    }
    return fromWei((new BigNumber(userData.value.bammUserBalance).dividedBy(userData.value.bammTotalSupply)).multipliedBy(userData.value.lusdTotal))
  });
  const ethIsGreaterThanOnePerMile = computed(()=> {
    if(userBammInUsd.value === "0"){
      return false;
    }
    const userEthInUsd = new BigNumber(ethUserBalance.value).multipliedBy(ethPrice.value)
    const ethInSp = userEthInUsd.dividedBy(userBammInUsd.value)
    return ethInSp.isGreaterThan(0.0001)
  })

  function lusdWithdrawAmountToBamm (lusd) {
    const bammWithdrawRatio = new BigNumber(lusd).dividedBy(userBammInUsd.value)
    const res = bammWithdrawRatio.multipliedBy(bammUserBalance.value).toString()
    return res
  }

  function absolutlWithdrawAmountInEth (lusd) {
    const bammWithdrawRatio = new BigNumber(lusd).dividedBy(userBammInUsd.value)
    const res = bammWithdrawRatio.multipliedBy(ethUserBalance.value).toString()
    return res
  }

  function absolutlWithdrawAmountInLusd (lusd) {
    const bammWithdrawRatio = new BigNumber(lusd).dividedBy(userBammInUsd.value)
    const res = bammWithdrawRatio.multipliedBy(lusdUserBalance.value).toString()
    return res
  }

  async function fetchUserData (){
    if (!library.value || !activeAccount.value) {
      return
    }
    const struct = await getUserInfo(activeAccount.value.address, library.value)
    const data = {}
    Object.keys(struct).filter(k=> isNaN(Number(k))).forEach(k=> {
      data[k] = struct[k]
    })
    userData.value = data
  }

  onEvent("protocol::bprotocol::refresh", fetchUserData);

  watch(
    library,
    async val => {
      if (val) {
        fetchUserData();
      }
    },
    { immediate: true }
  );

  watch(
    activeAccount,
    async val => {
      if (val) {
        fetchUserData();
      }
    },
    { immediate: true }
  );

  return { 
    bammTotalSupply,
    bammUserBalance,
    ethTotal,
    ethUserBalance,
    ethPrice,
    lusdTotal,  
    lusdUserBalance,
    unclaimedLqty,
    fetchUserData,
    userBammInLusd,
    lusdWithdrawAmountToBamm,
    bammToken,
    absolutlWithdrawAmountInEth,
    absolutlWithdrawAmountInLusd,
    userBammInUsd,
    totalBammSupplyInUsd,
    ethIsGreaterThanOnePerMile
  }
}

async function getUserInfo (user, web3){
  try {
    const resolveABI = abis.resolver.bprotocol;
    const resolveAddr = addresses.mainnet.resolver.bprotocol;
    const bammAddr = addresses.mainnet.bprotocolBamm;
    const bprotocolInstance = new web3.eth.Contract(
      resolveABI as AbiItem[],
      resolveAddr
    );
    const userInfo = await bprotocolInstance.methods.getUserInfo(user, bammAddr, '0x6DEA81C8171D0bA574754EF6F8b412F2Ed88c54D').call()
    return userInfo

  }catch (e) {
    console.error(e);
    return {};
  }
}