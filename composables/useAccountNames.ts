import { onMounted, ref } from "@nuxtjs/composition-api";

const store = ref({});

export function useAccountNames() {

  onMounted(() => {
    store.value = JSON.parse(
      window.localStorage.getItem(`account-names`) || "{}"
    );
  });

  function getAccountName(accountId) {
    return store.value[accountId] || "";
  }

  function setAccountName(accountId, name) {
    store.value[accountId] = name;

    window.localStorage.setItem(`account-names`, JSON.stringify(store.value));
  }

  return {
    getAccountName,
    setAccountName
  };
}
