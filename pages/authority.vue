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
            <div class="hidden mt-3 text-2xl font-semibold">Account Name</div>
          </div>

          <div>
            <div class="font-medium text-lg">
              Account address
            </div>
            <div
              class="mt-4 text-lg font-medium text-grey-dark flex items-center"
            >
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

    <div class="mt-12">
      <div class="flex justify-between items-center">
        <h3 class="text-semibold text-sm text-primary-gray uppercase">
          Authorities
        </h3>

        <ButtonCTA @click="addAuthority" class="h-8 w-52 text-xs uppercase font-semibold">
          Add authority
        </ButtonCTA>
      </div>

      <div
        class="mt-4 p-8 border border-[#DBE5F4] rounded-[2px] grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6"
      >
        <div
          v-for="authority in authorities"
          :key="authority"
          class="border border-[#DBE5F4] text-[#9FB0C9] rounded-[2px] flex items-center px-6 py-7"
        >
          <div>
            <svg
              width="16"
              height="18"
              viewBox="0 0 16 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 9C10.525 9 12.5714 6.98555 12.5714 4.5C12.5714 2.01445 10.525 0 8 0C5.475 0 3.42857 2.01445 3.42857 4.5C3.42857 6.98555 5.475 9 8 9ZM11.4214 10.1461L9.71429 16.875L8.57143 12.0938L9.71429 10.125H6.28571L7.42857 12.0938L6.28571 16.875L4.57857 10.1461C2.03214 10.2656 0 12.3152 0 14.85V16.3125C0 17.2441 0.767857 18 1.71429 18H14.2857C15.2321 18 16 17.2441 16 16.3125V14.85C16 12.3152 13.9679 10.2656 11.4214 10.1461Z"
                fill="#9FB0C9"
              />
            </svg>
          </div>
          <a
            :href="`${addressDetailsLink}/${authority}`"
            target="_blank"
            class="hover:underline flex-1 text-center font-medium text-lg text-primary-black truncate px-4"
          >
            {{ shortenHash(authority, 16) }}
          </a>
          <button @click="deleteAuthority(authority)">
            <Icon name="trash" class="w-5"></Icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "@nuxtjs/composition-api";
import ButtonCTA from "~/components/common/input/ButtonCTA.vue";
import RemoveAuthorityDialog from "~/components/modal/authority/RemoveAuthorityDialog.vue";
import AddAuthorityDialog from "~/components/modal/authority/AddAuthorityDialog.vue";
import { useBalances } from "~/composables/useBalances";
import { useCopiedToClipboardUx } from "~/composables/useCopiedToClipboardUx";
import { useDSA } from "~/composables/useDSA";
import { useFormatting } from "~/composables/useFormatting";
import { useLink } from "~/composables/useLink";
import { useModal } from "~/composables/useModal";

export default defineComponent({
  components: { ButtonCTA },
  setup() {
    const {
      accounts,
      activeAccount,
      setAccount,
      createAccount,
      creatingAccount,
      authorities
    } = useDSA();
    const { shortenHash } = useFormatting();
    const { fetchBalances } = useBalances();
    const { onCopy, tooltip, copied } = useCopiedToClipboardUx();
    const { addressDetailsLink } = useLink();
    const { showComponent } = useModal();

    watch(activeAccount, val => val && fetchBalances(true));

    const deleteAuthority = (authority: string) => {
      showComponent(RemoveAuthorityDialog, { authority });
    };

    const addAuthority = () => {
      showComponent(AddAuthorityDialog);
    };

    return {
      addressDetailsLink,
      shortenHash,
      accounts,
      activeAccount,
      setAccount,
      createAccount,
      creatingAccount,
      authorities,
      onCopy,
      tooltip,
      copied,
      deleteAuthority,
      addAuthority,
    };
  }
});
</script>
