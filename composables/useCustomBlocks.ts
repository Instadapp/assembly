import { ref, computed, useContext } from "@nuxtjs/composition-api";
import { useSidebarBlockData } from "~/composables/useSidebarBlockData";

export function useCustomBlocks() {
  const { app, store } = useContext();
  const { getBlockData } = useSidebarBlockData();
  const search = ref("");

  const filteredBlocks = computed(() => {
    if (!search.value) return protocolsList.value;

    const arrCopy = JSON.parse(JSON.stringify(protocolsList.value));
    const result = [];
    const term = search.value.toLowerCase();
    const re = new RegExp(term, "i");

    arrCopy.forEach(protocol => {
      const filteredBlocks = protocol.blocks.filter(block =>
        re.test(block.name)
      );

      if (filteredBlocks.length) {
        protocol.blocks = filteredBlocks;
        result.push(protocol);
      }
    });

    return result;
  });

  function startNewBlockSetup(protocol, block) {
    createNewBlock(protocol, block);
    openBlockSetupSidebar(block.type);
  }

  function startBlockEdit(block) {
    store.dispatch("custom-strategy/setSelectedBlock", {
      type: block.type,
      blockData: block
    });
    openBlockSetupSidebar(block.type);
  }

  function createNewBlock(protocol, block) {
    const blockData = { protocol, id: -1 };
    store.dispatch("custom-strategy/setSelectedBlock", {
      type: block.type,
      blockData
    });
  }

  function openBlockSetupSidebar(type) {
    const blockData = getBlockData(type);
    if (blockData && blockData.hash) {
      app.router.push({
        hash: blockData.hash
      });
    }
  }

  const protocolsList = ref([
    {
      name: "Uniswap",
      tokenKey: "uni",
      blocks: [
        { name: "Swap Token", type: "swap-token" },
        { name: "Add Liqudity" },
        { name: "Remove Liquidity" }
      ]
    },
    {
      name: "Aave",
      tokenKey: "aave",
      blocks: [
        { name: "Flash Loan", type: "flashloan" },
        { name: "Deposit" },
        { name: "Withdraw" }
      ]
    },
    {
      name: "Makerdao",
      tokenKey: "mkr",
      blocks: [
        { name: "Swap Token", type: "swap-token" },
        { name: "Add Liqudity" },
        { name: "Remove Liquidity" }
      ]
    },
    {
      name: "Compound",
      tokenKey: "comp",
      blocks: [
        { name: "Flash Loan", type: "flashloan" },
        { name: "Deposit" },
        { name: "Withdraw" }
      ]
    }
  ]);

  return {
    search,
    filteredBlocks,
    startNewBlockSetup,
    openBlockSetupSidebar,
    startBlockEdit
  };
}
