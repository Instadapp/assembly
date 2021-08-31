import { useModal } from "./useModal";
import Web3Modal from "~/components/modal/web3/Web3Modal.vue";

export const useWeb3Modal = () => {
  const { showComponent } = useModal();
  
  return {
    open: () => showComponent(Web3Modal)
  };
};
