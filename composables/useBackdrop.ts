import { computed } from "@nuxtjs/composition-api";
import { useSidebar } from "./useSidebar";

export function useBackdrop() {
  const { isOpen: isSidbarOpen, close: closeSidbar } = useSidebar();

  const isShown = computed(() => isSidbarOpen.value);

  function close() {
    if (isSidbarOpen.value) {
      closeSidbar();
    }
  }

  return { isShown, close };
}
