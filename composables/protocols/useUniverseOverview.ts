import { onMounted, ref, useContext } from '@nuxtjs/composition-api';

const overview = ref<OverviewModel>({
  tvl: 0, totalProfits: 0, totalGasSaved: 0
});

type OverviewModel = {
  tvl: number
  totalProfits: number
  totalGasSaved: number
}

export function useUniverseOverview() {
  const { $axios } = useContext();

  const fetchOverview = async () => {
    const { data } = await $axios
      .$get<{ data: OverviewModel }>("https://api.webwxk.com/singleVault/universe/instadapp/overview")

  
    overview.value = data;
  };

  onMounted(() => {
    fetchOverview();
  });

  return {
    overview
  };
}
