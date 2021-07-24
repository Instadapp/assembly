import { useNotification } from "@/composables/useNotification";
import SwapTokenBlock from "@/core/entity/swap-token-block";

const { showNotImplemented } = useNotification();

const blocks = {
  "swap-token": {
    hash: "setup-swap-token",
    entity: SwapTokenBlock
  }
};

export function useSidebarBlockData() {
  function getBlockData(type) {
    const block = blocks[type];
    const hash = block ? block.hash : null;

    return { hash };
  }

  function createBlockFactory({ type, blockData }) {
    const block = blocks[type];
    const BlockEntity = block ? block.entity : null;

    if (BlockEntity) {
      return new BlockEntity(blockData);
    } else {
      showNotImplemented();
    }
  }

  return { getBlockData, createBlockFactory };
}
