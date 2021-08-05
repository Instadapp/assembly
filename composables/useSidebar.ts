import {
  computed,
  nextTick,
  ref,
  useContext,
  useRouter,
  watch
} from "@nuxtjs/composition-api";

import { useDSA } from "./useDSA";
import { useWeb3 } from "./useWeb3";
//@ts-ignore
import SidebarAaveV2Supply from "~/components/sidebar/context/aaveV2/SidebarAaveV2Supply.vue";
//@ts-ignore
import SidebarAaveV2Withdraw from '~/components/sidebar/context/aaveV2/SidebarAaveV2Withdraw.vue'
//@ts-ignore
import SidebarAaveV2Borrow from '~/components/sidebar/context/aaveV2/SidebarAaveV2Borrow.vue'
//@ts-ignore
import SidebarAaveV2Payback from '~/components/sidebar/context/aaveV2/SidebarAaveV2Payback.vue'
//@ts-ignore
import SidebarOverview from '~/components/sidebar/context/overview/SidebarOverview.vue'
//@ts-ignore
import SidebarDepositOverview from '~/components/sidebar/context/SidebarDepositOverview.vue'
//@ts-ignore
import SidebarWithdraw from '~/components/sidebar/context/SidebarWithdraw.vue'

const sidebars = {
  "#overview" :  {component: SidebarOverview, back : false, close : true },
  "#deposit-overview": {component: SidebarDepositOverview, back: { hash: 'overview' }  },
  '#withdraw-token': { component: SidebarWithdraw, back: { hash: 'overview' } },
  "/polygon/aave-v2": { component: null },
  "/polygon/aave-v2#supply": { component: SidebarAaveV2Supply },
  "/polygon/aave-v2#borrow": { component: SidebarAaveV2Borrow },
  "/polygon/aave-v2#payback": { component: SidebarAaveV2Payback },
  "/polygon/aave-v2#withdraw": { component: SidebarAaveV2Withdraw },
  "/polygon/aave-v2#withdraw-token": {
    component: null,
    back: { hash: "withdraw-overview" }
  },


  "/mainnet/aave-v2": { component: null },
  "/mainnet/aave-v2#supply": { component: SidebarAaveV2Supply },
  "/mainnet/aave-v2#borrow": { component: SidebarAaveV2Borrow },
  "/mainnet/aave-v2#payback": { component: SidebarAaveV2Payback },
  "/mainnet/aave-v2#withdraw": { component: SidebarAaveV2Withdraw },
  "/mainnet/aave-v2#withdraw-token": {
    component: null,
    back: { hash: "withdraw-overview" }
  }
};

const sidebar = ref(null);
const props = ref(null);

export function init() {
  const { route } = useContext();
  const router = useRouter()
  const { active } = useWeb3();
  const { dsa } = useDSA();

  watch(
    [route, active, dsa],
    async ([route, active, dsa], [oldRoute, oldActive, oldDsa]) => {
      await nextTick();

      const hasPathChanged = !oldRoute || route.path !== oldRoute.path;
      const hasIsLoggedInChanged = active !== oldActive;
      const hasDsaChanged = dsa !== oldDsa;

      const [hash, params] = route.hash.split("?");
      
      if (hasPathChanged){
        router.push({ hash: null })
        return
      }

      sidebar.value = sidebars[route.path + hash] || sidebars[hash];
        
      if (!sidebar.value) {
        props.value = {};
        return;
      }

      if (!params) {
        props.value = {};
        return;
      }

      // parse url params (example: `prop1=value1&prop2=value2`)
      props.value = params.split("&").reduce((props, entry) => {
        const [key, value] = entry.split("=");
        props[key] = value;
        return props;
      }, {});
    },
    { immediate: true }
  );
}

export function useSidebar() {
  const { route } = useContext();
  const router = useRouter();

  function close() {
    router.push({ hash: null });
  }

  function back() {
    const location = sidebar.value?.back || { hash: null };

    router.push(location);
  }

  const component = computed(() => sidebar.value?.component);

  const isOpen = computed(() => {
    if (!route.value.hash) return false;

    return !!component.value;
  });

  const showSidebarBalances = () => {
    router.push({ hash: 'overview' });
  }

  return {
    close,
    back,
    component,
    props,
    isOpen,
    showSidebarBalances
  };
}
