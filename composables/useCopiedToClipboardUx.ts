import { computed, ref } from "@nuxtjs/composition-api";

export function useCopiedToClipboardUx() {
  const copied = ref(false);
  let copiedTimeout;

  function onCopy() {
    if (copiedTimeout) {
      clearTimeout(copiedTimeout);
      copiedTimeout = null;
    }

    copied.value = true;
    copiedTimeout = setTimeout(() => {
      copied.value = false;
      copiedTimeout = null;
    }, 1800);
  }

  const tooltip = computed(() => ({
    content: "Copied!",
    trigger: "manual",
    show: copied.value
  }));

  return { onCopy, tooltip, copied };
}
