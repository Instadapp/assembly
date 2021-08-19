<template>
  <div>
    <h2 class="text-2xl font-bold text-center">Account Settings</h2>

    <div class="mt-12">
      <h3 class="text-semibold text-sm text-primary-gray uppercase">
        Accounts
      </h3>

      <div class="mt-4 md:flex md:justify-between md:items-center">
        <div class="flex gap-3.5 overflow-y-scroll">
          <div
            @click="setAccount(account)"
            v-for="account in accounts"
            :key="account.id"
            class="rounded-[2px] border-2 w-24 overflow-hidden cursor-pointer flex-shrink-0"
            :class="[
              activeAccount.id === account.id
                ? 'border-primary-blue-dark'
                : 'border-[#DBE5F4]'
            ]"
          >
            <div
              class="p-1 text-xs font-semibold"
              :class="[
                activeAccount.id === account.id
                  ? 'bg-primary-blue-dark text-white'
                  : 'bg-[#DBE5F4]'
              ]"
            >
              #{{ account.id }}
            </div>
            <div class="p-1 text-xs truncate font-semibold text-primary-black">
              {{ account.address }}
            </div>
          </div>
        </div>

        <button
          :disabled="creatingAccount"
          @click="createAccount"
          class="mt-6 md:mt-0 w-full md:w-auto h-12 px-8 py-5 flex items-center justify-center text-primary-blue-dark shadow border border-primary-blue-dark hover:border-primary-blue-hover rounded-[4px] hover:text-primary-blue-hover"
        >
          Create New
        </button>
      </div>

      <div class="border-t border-[#556D9C] opacity-[0.15] my-6"></div>

      <div
        class="p-8 border border-[#DBE5F4] rounded-[2px] flex items-center justify-between"
      >
        <div class="flex flex-col justify-between flex-grow ">
          <div class="mb-8">
            <div class="text-semibold text-sm text-grey-dark uppercase">
              #{{ activeAccount.id }}
            </div>
            <div v-if="false" class="mt-3 text-2xl font-semibold">Account Name</div>
          </div>

          <div>
            <div class="font-medium text-lg">
              Account address
            </div>
            <div class="mt-4 text-lg font-medium text-grey-dark flex items-center">
              {{ activeAccount.address }}

              <button
              class="ml-3"
                v-tooltip.bottom="tooltip"
                v-clipboard:copy="activeAccount.address"
                v-clipboard:success="onCopy"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 5H6C5.46957 5 4.96086 5.21071 4.58579 5.58579C4.21071 5.96086 4 6.46957 4 7V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V18M8 5C8 5.53043 8.21071 6.03914 8.58579 6.41421C8.96086 6.78929 9.46957 7 10 7H12C12.5304 7 13.0391 6.78929 13.4142 6.41421C13.7893 6.03914 14 5.53043 14 5M8 5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H12C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5M14 5H16C16.5304 5 17.0391 5.21071 17.4142 5.58579C17.7893 5.96086 18 6.46957 18 7V10M20 14H10M10 14L13 11M10 14L13 17"
                    stroke="#A5ADC6"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div>
          <QrCode
            v-if="activeAccount"
            :value="activeAccount.address"
            :width="96"
          />
        </div>
      </div>
    </div>

    <div class="mt-12 hidden">
      <h3 class="text-semibold text-sm text-primary-gray-dark uppercase">
        Authorities
      </h3>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "@nuxtjs/composition-api";
import { useBalances } from "~/composables/useBalances";
import { useCopiedToClipboardUx } from "~/composables/useCopiedToClipboardUx";
import { useDSA } from "~/composables/useDSA";
export default defineComponent({
  components: {},
  setup() {
    const {
      accounts,
      activeAccount,
      setAccount,
      createAccount,
      creatingAccount
    } = useDSA();
    const { fetchBalances } = useBalances();
    const { onCopy, tooltip, copied } = useCopiedToClipboardUx();

    watch(activeAccount, val => val && fetchBalances(true));

    return {
      accounts,
      activeAccount,
      setAccount,
      createAccount,
      creatingAccount,
      onCopy,
      tooltip,
      copied
    };
  }
});
</script>
