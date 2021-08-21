<template>
  <SidebarContextContainer class="h-full">
    <SidebarContextHeader>{{ meta.title }}</SidebarContextHeader>

    <div class="overflow-y-scroll scrollbar-hover">
      <div class="mx-auto" style="max-width: 296px">
        <div class="py-2 sm:py-4">
          <template v-for="(component, index) in components">
            <!-- eslint-disable vue/no-v-html -->
            <div
              v-if="component.type === 'html'"
              :key="index"
              class="flex-shrink-0 font-medium prose prose-xs"
              :style="{ minHeight: component.minHeight || '96px' }"
              v-html="component.html"
            ></div>
            <!-- eslint-enable vue/no-v-html -->

            <div
              v-else-if="component.type === 'loading-spinner'"
              :key="index"
              class="flex justify-center flex-shrink-0 h-12"
            >
              <SVGSpinner class="h-4 animate-spin-loading" />
            </div>

            <div v-else-if="component.type === 'input'" :key="index">
              {{ component.text }}
            </div>

            <InputAmount
              v-else-if="component.type === 'input-amount'"
              :key="index"
              :value="component.value"
              :disabled="component.disabled || pending"
              :token-key="component.tokenKey"
              :badge-value="component.badgeValue"
              :badge-loading="component.badgeLoading"
              :placeholder="component.placeholder"
              :error="errors[component.errorKey].message"
              @input="component.onInput"
            />

            <InputNumeric
              v-else-if="component.type === 'input-numeric'"
              :key="index"
              :placeholder="component.placeholder"
              :value="component.value"
              :error="errors[component.errorKey].message"
              :show-error="errors[component.errorKey].show"
              @input="component.onInput"
            />

            <div
              v-if="component.type === 'toggle-button'"
              :key="index"
              class="flex items-center"
            >
              <div class="font-semibold">{{ component.label }}</div>
              <Info
                v-if="!!component.info"
                :text="component.info"
                class="ml-1"
              />
              <ToggleButton
                :checked="component.checked"
                class="ml-auto"
                @change="component.onChange"
              />
            </div>

            <SidebarContextHeading
              v-else-if="component.type === 'heading'"
              :key="index"
            >
              {{ component.text }}
            </SidebarContextHeading>

            <div
              v-else-if="component.type === 'label-with-check-icon'"
              :key="index"
              class="flex items-center justify-between"
            >
              <div class="mr-3">{{ component.label }}</div>
              <div class="flex items-center justify-center w-10 px-2px">
                <Icon
                  v-if="component.checked"
                  name="check"
                  class="h-6 text-green-pure"
                />
                <Icon v-else name="x" class="h-6 text-red-500" />
              </div>
            </div>

            <div v-else-if="component.type === 'value'" :key="index">
              <ValueDisplay :label="component.label">{{
                component.value
              }}</ValueDisplay>
            </div>

            <div
              v-else-if="component.type === 'value-with-token'"
              :key="index"
              class="flex justify-between flex-shrink-0 h-18"
            >
              <ValueDisplay :label="component.label" class="mr-3">
                <template v-if="component.valueBadge != null" #badge>{{
                  component.valueBadge
                }}</template>
                {{ component.value }}
              </ValueDisplay>
              <IconCurrency :currency="component.tokenKey" />
            </div>

            <div
              v-else-if="component.type === 'value-with-token-no-badge'"
              :key="index"
              class="flex justify-between flex-shrink-0"
            >
              <ValueDisplay :label="component.label" class="mr-3">
                {{ component.value }}
              </ValueDisplay>
              <IconCurrency :currency="component.tokenKey" />
            </div>

            <div
              v-else-if="component.type === 'value-with-token-select'"
              :key="index"
              class="flex justify-between flex-shrink-0 h-18"
            >
              <ValueDisplay :label="component.label" class="mr-3">
                <template v-if="component.valueBadge != null" #badge>{{
                  component.valueBadge
                }}</template>
                {{ component.value }}
              </ValueDisplay>
              <TokenSelect
                :disabled="component.disabled || pending"
                :tokens="component.tokens"
                :token-key="component.tokenKey"
                @change="component.onChange"
              />
            </div>

            <div
              v-else-if="component.type === 'value-with-token-button'"
              :key="index"
            >
              <div class="flex justify-between mb-3">
                <ValueDisplay :label="component.label" class="mr-3">
                  {{ component.value }}
                </ValueDisplay>
                <IconCurrency :currency="component.tokenKey" />
              </div>
              <ButtonCTA
                class="w-full"
                :disabled="component.disabled || !isValid || pending"
                :loading="component.loading"
                @click="wrapSubmit(component.onSubmit)"
              >
                {{ component.buttonLabel }}
              </ButtonCTA>
            </div>

            <div
              v-else-if="component.type === 'value-with-pool-token-button'"
              :key="index"
            >
              <div class="flex justify-between mb-3">
                <ValueDisplay :label="component.label" class="mr-3">
                  {{ component.value }}
                </ValueDisplay>
                <div class="relative z-0 flex -space-x-4 overflow-hidden">
                  <IconCurrency
                    :currency="component.tokenOne"
                    class="relative z-20 w-12 h-12"
                  />
                  <IconCurrency
                    :currency="component.tokenTwo"
                    class="relative z-10 w-12 h-12"
                  />
                </div>
              </div>
              <ButtonCTA
                class="w-full"
                :disabled="component.disabled || !isValid || pending"
                :loading="component.loading"
                @click="wrapSubmit(component.onSubmit)"
              >
                {{ component.buttonLabel }}
              </ButtonCTA>
            </div>

            <div
              v-else-if="component.type === 'horizontal-badge-value'"
              :key="index"
              class="flex items-center justify-between flex-shrink-0"
            >
              <ValueDisplayLabel class="mr-3">{{
                component.label
              }}</ValueDisplayLabel>
              <Badge :color="component.color">{{ component.value }}</Badge>
            </div>

            <SidebarSectionStatus
              v-else-if="component.type === 'status'"
              :key="index"
              :liquidation="component.liquidation"
              :status="component.status"
            />

            <div
              v-else-if="component.type === 'slippage-select'"
              :key="index"
              class="flex items-center justify-between mt-4"
            >
              <div class="flex flex-col w-full h-18">
                <div class="flex items-center mb-4">
                  <ValueDisplayLabel>Slippage</ValueDisplayLabel>
                  <Info class="ml-1" text="We will use this slippage setting in all trade/swap actions including strategies.<br/>We don't allow set slippage more than 10% for the safety of our users." />
                </div>
              </div>
            </div>

            <div
              v-else-if="component.type === 'button-submit'"
              :key="index"
              class="flex flex-col flex-shrink-0"
            >
              <ButtonCTA
                class="w-full"
                :disabled="component.disabled || !isValid || pending"
                :loading="pending"
                @click="wrapSubmit(component.onSubmit)"
              >
                {{ component.label }}
              </ButtonCTA>

              <div
                v-if="
                  (!component.fee || component.fee === '0') &&
                    !meta.removeFeeText
                "
                class="mt-3 font-medium text-12 text-grey-pure"
              >
                Instadapp does not charge a fee for this operation.
                <!-- Find out <Link href="/fee" target="_blank" class="my-1"> more </Link>. -->
              </div>

              <div
                v-if="!!component.fee && component.fee !== '0'"
                class="mt-3 font-medium text-12 text-grey-pure"
              >
                Fee for this operation is {{ component.fee }}%.
                <!-- Find out <Link href="/fee" target="_blank" class="my-1"> more </Link>. -->
              </div>
            </div>

            <div
              v-else-if="component.type === 'text-comp'"
              :key="index"
              class="mt-3 font-medium text-center text-12 text-grey-pure"
            >
              Find out
              <Link href="/comp-delegation" target="_blank" class="my-1">
                more</Link
              >
              about COMP delegation.
            </div>

            <div
              v-else-if="component.type === 'rate-selection-aave'"
              :key="index"
            >
              <SidebarRateTypeSelect
                class="mt-6"
                :items="component.items"
                :borrow-stable-rate="component.borrowStableRate"
                :stable-borrow-enabled="component.stableBorrowEnabled"
                :value="component.value"
                @input="component.onChange"
              />
            </div>

            <hr
              v-if="showSeperator(index)"
              :key="`${index}-hr`"
              class="mt-4 mb-4"
            />
            <span
              v-else
              :key="`${index}-spacer`"
              class="flex-shrink-0 block h-4"
            ></span>
          </template>
          <ValidationErrors :error-messages="errorMessages" class="mt-2" />
        </div>
      </div>
    </div>
  </SidebarContextContainer>
</template>

<script>
import { ref, defineComponent, useContext, onBeforeMount } from '@nuxtjs/composition-api'
import SVGSpinner from '@/assets/img/icons/spinner.svg'
import { useValidation } from '~/composables/useValidation'
import { useStrategy } from '~/composables/strategies/useStrategy'
import { useSidebar } from '~/composables/useSidebar'
import { useNotification } from '~/composables/useNotification'
import InputAmount from '~/components/common/input/InputAmount.vue'
import InputNumeric from '~/components/common/input/InputNumeric.vue'
import ButtonCTA from '~/components/common/input/ButtonCTA.vue'
import ValueDisplayLabel from '../components/ValueDisplayLabel.vue'
import ValueDisplay from '../components/ValueDisplay.vue'
import ToggleButton from '~/components/common/input/ToggleButton.vue'

export default defineComponent({

  props: {
    protocol: {
      type: String,
      required: true,
    }
  },

  components: {
    SVGSpinner,
    InputAmount,
    InputNumeric,
    ButtonCTA,
    ValueDisplayLabel,
    ValueDisplay,
    ToggleButton,
  },

  setup(props) {
    const { meta, use } = useStrategy(props.protocol)
    const { close } = useSidebar()
    const { showError } = useNotification()

    if (!meta.value) {
      close()
      return
    }

    const { components, errors } = use()

    const { errorMessages, isValid } = useValidation(errors)

    onBeforeMount(async () => await updateState())

    async function updateState() {
      if (!meta?.value.protocols) {
        return
      }
      await store.dispatch('tokens/refreshPrices')
      const protocols = meta.value.protocols

      // refresh protocol data
    }

    const pending = ref(false)
    async function wrapSubmit(fn) {
      pending.value = true
      try {
        await fn()
      } catch (error) {
        console.log(error)
        showError(
          'Something went wrong',
          'Our team has been notified and will work on a solution. Get in touch if you want to provide further information.',
          0
        )
      } finally {
        pending.value = false
      }
    }

    function getNextComponent(index) {
      const nextIndex = index + 1

      if (nextIndex > components.length - 1) return null

      return components.value[nextIndex]
    }

    function showSeperator(index) {
      const nextComponent = getNextComponent(index)

      if (!nextComponent) return false

      const currentComponent = components.value[index]

      if (currentComponent.type.startsWith('input') && nextComponent.type.startsWith('input')) return false

      return true
    }

    return {
      meta,
      components,
      errors,
      pending,
      errorMessages,
      isValid,
      wrapSubmit,
      showSeperator,
    }
  },
})
</script>
