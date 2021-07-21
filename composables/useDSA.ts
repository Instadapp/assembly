import { computed, readonly, ref, watch } from "@nuxtjs/composition-api";
import { useWeb3 } from "./useWeb3";
//@ts-ignore
import DSA from "dsa-connect";

const dsa = ref<DSA>();
const accounts = ref<any[]>([]);
const activeAccount = ref<any>();

export function useDSA() {
  const { web3, chainId } = useWeb3();

  watch(
    web3,
    () => {
      if (web3.value) {
        dsa.value = new DSA(web3.value, chainId.value);
      }
    },
    { immediate: true }
  );

  watch(
    dsa,
    async () => {
      if (dsa.value) {
        accounts.value = await dsa.value.getAccounts();

        if (accounts.value.length > 0) {
          activeAccount.value = accounts.value[0];
        }
      }
    },
    { immediate: true }
  );

  const creatingAccount = ref(false);

  async function createAccount() {
    creatingAccount.value = true;
    try {
      const transactionHash = await dsa.value.build({ version: 2 });

      accounts.value = await dsa.value.getAccounts();
      return transactionHash;
    } catch (error) {
    } finally {
      creatingAccount.value = false;
    }
  }

  function setAccount(account: any) {
    activeAccount.value = account;
  }

  return {
    dsa,
    activeAccount: readonly(activeAccount),
    accounts,
    createAccount,
    creatingAccount,
    setAccount,
    web3,
    chainId
  };
}
