import { computed, ref } from "@nuxtjs/composition-api";
//@ts-ignore
import NetworksMismatchDialog from "~/components/modal/NetworksMismatchDialog";

const modal = ref(null);
const props = ref({});

export function useModal() {
  function showNetworksMismatchDialog() {
    modal.value = NetworksMismatchDialog;
  }

  function close() {
    //@ts-ignore
    if (props.value?.persistent) return;
    modal.value = null;
    props.value = null;
  }

  function closePersistent() {
    modal.value = null;
    props.value = null;
  }

  const isShown = computed(() => !!modal.value);

  return {
    showNetworksMismatchDialog,
    close,
    closePersistent,
    isShown,
    modal: computed(() => modal.value),
    props: computed(() => props.value)
  };
}
