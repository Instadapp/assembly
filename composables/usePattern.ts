const amountPattern = /^\d*([,\\.]\d*)?$/;

const notAlphaNumPattern = /[^A-Za-z0-9\s]+/gi;

export function usePattern() {
  return { amountPattern, notAlphaNumPattern };
}
