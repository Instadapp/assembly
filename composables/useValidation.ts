import { computed } from "@nuxtjs/composition-api";

export function useValidation(errorsRef) {
  const errorMessages = computed(() =>
    Object.values(errorsRef.value)
      .filter(({ message, show }) => !!message && show)
      .map(({ message }) => message)
  );

  const isValid = computed(() =>
    Object.values(errorsRef.value).every(
      ({ message, messageOnly }) => message === null || messageOnly === true
    )
  );

  return { errorMessages, isValid };
}
