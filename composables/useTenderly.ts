import { useContext, ref, onMounted, computed } from "@nuxtjs/composition-api";
import axios from "axios";
import { activeNetwork, useNetwork } from "./useNetwork";
import { useWeb3 } from "./useWeb3";
import Web3 from "web3";
import { useDSA } from "./useDSA";

const forkId = ref(null);
export function useTenderly() {
  const { $config } = useContext();
  const { setWeb3, refreshWeb3 } = useWeb3();
  const { accounts, refreshAccounts } = useDSA();
  const canSimulate = computed(
    () => $config.TENDERLY_FORK_PATH && $config.TENDERLY_KEY
  );
  const loading = ref(false);

  onMounted(() => {
    if (!canSimulate.value) {
      return;
    }

    setTimeout(() => {
      setForkId(window.localStorage.getItem("forkId"));
    }, 1000);
  });

  const startSimulation = async () => {
    loading.value = true;
    try {
      const { data } = await axios({
        method: "post",
        url: `https://api.tenderly.co/api/v1/account/${$config.TENDERLY_FORK_PATH}/fork`,
        headers: {
          "X-Access-key": $config.TENDERLY_KEY,
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          network_id: activeNetwork.value.chainId.toString()
        })
      });

      await setForkId(data?.simulation_fork?.id);
      if (data?.simulation_fork?.id) {
        await addBalance();
        await refreshAccounts();
      }
    } catch (error) {
      await stopSimulation();
    }
    loading.value = false;
  };

  const stopSimulation = async () => {
    loading.value = true;
    try {
      await axios({
        method: "delete",
        url: `https://api.tenderly.co/api/v1/account/${$config.TENDERLY_FORK_PATH}/fork/${forkId.value}`,
        headers: {
          "X-Access-key": $config.TENDERLY_KEY,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {}

    forkId.value = null;
    window.localStorage.removeItem("forkId");
    await refreshWeb3();
    loading.value = false;
  };

  const setForkId = fork => {
    if (!fork) {
      stopSimulation();
      return;
    }

    forkId.value = fork;
    setWeb3(
      new Web3(
        new Web3.providers.HttpProvider(
          `https://rpc.tenderly.co/fork/${forkId.value}`
        )
      )
    );
    window.localStorage.setItem("forkId", forkId.value);
  };

  const addBalance = async () => {
    await axios({
      method: "post",
      url: `https://api.tenderly.co/api/v1/account/${$config.TENDERLY_FORK_PATH}/fork/${forkId.value}/balance`,
      headers: {
        "X-Access-key": $config.TENDERLY_KEY,
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        accounts: accounts.value.map(a => a.address)
      })
    });
  };

  return {
    forkId,
    canSimulate,
    startSimulation,
    stopSimulation,
    loading,
  };
}
