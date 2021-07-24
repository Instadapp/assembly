import { ref } from "@nuxtjs/composition-api";
import { useFormatting } from "@/composables/useFormatting";
import { getEtherscanLink, getMaticLink, getTenderlyLink } from "./useLink";
import { useRandom } from "./useRandom";
const { makeid } = useRandom();

const queue = ref([]);

export function useNotification() {
  const { shortenHash } = useFormatting();

  function close(key) {
    queue.value = queue.value.filter(item => item.key !== key);
  }

  function closeAll() {
    queue.value.forEach((item, index) => {
      setTimeout(() => {
        queue.value.shift();
      }, index * 150);
    });
  }

  function closeAwaiting(title, success = true, key) {
    const found = queue.value.find(item => item.key === key);
    if (!found) return;

    if (success) {
      found.icon = "success";
      found.title = title;
    } else {
      found.icon = "error";
      found.title = title;
    }

    setTimeout(() => {
      close(key);
    }, 2000);
  }

  /**
   * Ques a notification to show to the user.
   *
   * @param {string} params.icon Icon of notification
   * @param {string} params.title Title of notification
   * @param {string} params.body Body text of notification
   * @param {string} params.href Link of notification body
   * @param {number} params.duration  Duration in ms. 0 for no timeout
   * @param {string} params.key key for notification identification
   */
  function show(params) {
    if (params) {
      if (!params.key) params.key = makeid(10);
      queue.value.push(params);
    }
  }

  function showError(title, body, href) {
    show({ icon: "error", title, body, href, duration: 0 });
  }

  function showWarning(title, body) {
    show({ icon: "warning", title, body, duration: 0 });
  }

  function showNotImplemented() {
    show({
      icon: "warning",
      title: "Not implemented",
      body: "This feature is not yet implemented."
    });
  }

  function showSuccess(title, body) {
    show({ icon: "success", title, body, duration: 5000 });
  }

  function showInfo(title, body) {
    show({ icon: "info", title, body, duration: 7000 });
  }

  function showAwaiting(title, body) {
    const key = makeid(10);
    show({ icon: "spinner", title, body, duration: 0, key });
    return key;
  }

  function showPendingTransaction(transactionHash, network) {
    let href;
    if (network === "matic") {
      href = getMaticLink(transactionHash);
    } else {
      href = getEtherscanLink(transactionHash);
    }
    const body = shortenHash(transactionHash);

    show({
      icon: "pending-transaction",
      title: "Pending transaction",
      href,
      body,
      duration: 0,
      key: transactionHash
    });
  }

  function showConfirmedTransaction(transactionHash, network) {
    let href;
    if (network === "matic") {
      href = getMaticLink(transactionHash);
    } else {
      href = getEtherscanLink(transactionHash);
    }
    const body = shortenHash(transactionHash);

    const found = queue.value.find(item => item.key === transactionHash);
    if (found) {
      found.icon = "success";
      found.title = "Transaction Confirmed";
      found.href = href;
      found.body = body;
    } else {
      show({
        icon: "success",
        title: "Transaction Confirmed",
        href,
        body,
        duration: 0
      });
    }
  }

  function showConfirmedSimulation(transactionId) {
    const href = getTenderlyLink(transactionId);
    const body = shortenHash(transactionId);

    show({
      icon: "success",
      title: "Successfully Simulated",
      href,
      body,
      duration: 5000
    });
  }

  function showLoggedIn(title, body) {
    show({ icon: "logged-in", title, body, duration: 2000 });
  }
  function showLoggedOut(title, body) {
    show({ icon: "logged-out", title, body, duration: 2000 });
  }

  return {
    queue,
    close,
    closeAwaiting,
    showError,
    showWarning,
    showNotImplemented,
    showSuccess,
    showInfo,
    showPendingTransaction,
    showConfirmedTransaction,
    showConfirmedSimulation,
    showLoggedIn,
    showLoggedOut,
    showAwaiting,
    closeAll
  };
}
