import { computed, ref, useRouter } from "@nuxtjs/composition-api";
import { strategies as aaveV2 } from "./aaveV2";

const strategyId = ref(null);
const protocolStrategies = {
  aaveV2
};

export function useStrategy(protocol: string) {
  const router = useRouter();

  const strategies = computed(() => {
    let strategies = protocolStrategies[protocol];
    if (!strategies) {
      return [];
    }
    return strategies.filter(
      s => s.meta.isShown === undefined || s.meta.isShown
    );
  });

  const strategy = computed(() =>
    strategies.value.find(strategy => strategy.meta.id === strategyId.value)
  );

  function select(id: string) {
    strategyId.value = id;

    setImmediate(() => {
      router.push({ hash: `strategy?protocol=${protocol}` });
    });
  }

  function use() {
    if (!strategy.value) {
      throw new Error("No strategy is chosen");
    }

    if (!strategy.value.use) {
      throw new Error("Invalid strategy: Strategy has no use function");
    }

    if (typeof strategy.value.use !== "function") {
      throw new TypeError("Invalid strategy: `use` is no function");
    }

    return strategy.value.use();
  }

  function show(id: string) {
    strategyId.value = id;
  }

  return {
    strategies,
    strategy,
    meta: computed(() => strategy.value?.meta),
    show,
    select,
    use
  };
}
