<template>
  <dropdown>
    <template #trigger="{ toggle, isShown }">
      <Button
        :class="{
          'bg-grey-light': isShown
        }"
        :large="true"
        color="grey"
        class="w-20 px-3 xxl:w-23"
        aria-label="Reflexer Dropdown"
        aria-haspopup="true"
        @click="toggle()"
      >
        <span class="mr-2">#{{ safeId }}</span>

        <SVGChevronUp
          class="ml-auto"
          :class="{ 'transform rotate-180': !isShown }"
        />
      </Button>
    </template>

    <template #menu="{ close }">
      <dropdown-menu style="width: 240px; max-height: 440px">
        <div class="flex flex-col overflow-x-hidden overflow-y-auto scrollbar-hover scrollbar">
          <button
            v-for="safe in safes"
            :key="safe.id"
            class="flex items-center w-full px-4 py-2 hover:bg-opacity-50 focus:bg-opacity-50 hover:bg-grey-light dark:hover:bg-dark-300 dark:focus:bg-dark-300 focus:outline-none focus:bg-grey-light"
            @click="setSafe(safe.id, close)"
          >
            <div class="mr-2 font-semibold whitespace-no-wrap">
              #{{ safe.id }}
            </div>
            <IconCurrency
              :currency="safe.tokenKey"
              class="w-6 h-6 ml-auto"
              no-height
            />
          </button>
        </div>

        <hr v-if="!!safes.length" class="w-full my-2" />

        <button
          class="flex items-center w-full px-4 py-2 font-medium hover:bg-opacity-75 focus:bg-opacity-75 text-ocean-blue-pure hover:bg-ocean-blue-light focus:bg-ocean-blue-light focus:outline-none dark:hover:bg-opacity-17 dark:focus:bg-opacity-17"
          @click="openNewSafe(close)"
        >
          New Safe
        </button>
      </dropdown-menu>
    </template>
  </dropdown>
</template>

<script>
import { defineComponent, useRouter } from '@nuxtjs/composition-api'
import SVGChevronUp from '@/assets/img/icons/chevron-up.svg?inline'
import { useReflexerPosition } from '~/composables/protocols/useReflexerPosition'
import { useSidebar } from '~/composables/useSidebar'
import Dropdown from '../../common/input/Dropdown.vue'
import DropdownMenu from '../DropdownMenu.vue'

export default defineComponent({
  components: {
    SVGChevronUp,
    Dropdown,
    DropdownMenu,
  },

  setup() {
    const router  = useRouter()
    const { safeId, safes, selectSafe, isNewSafe } = useReflexerPosition()
    const { back } = useSidebar()

    function openNewSafe(cb) {
      router.push({ hash: 'collateral' })

      cb();
    }

    function setSafe(safeId, cb) {
      selectSafe(safeId)

      if (isNewSafe.value) {
        back()
      }

      cb()
    }

    return { safeId, safes, openNewSafe, setSafe }
  },
})
</script>
