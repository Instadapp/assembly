<template>
  <SidebarContextContainer class="h-full overflow-hidden">
    <SidebarContextHeader>
      <h1 class="font-bold text-primary-black text-lg">
        {{ activeStrategy.schema.name }}
      </h1>
      <p
        v-if="activeStrategy.schema.author"
        class="font-medium text-[#1874FF] text-sm mt-2.5"
      >
        {{ activeStrategy.schema.author }}
      </p>
    </SidebarContextHeader>

    <div class="h-full overflow-y-scroll scrollbar-hover flex flex-col">
      <div class="mx-auto mb-6" style="width: 296px">
        <div
          class="flex-shrink-0 font-medium prose prose-sm text-primary-gray"
          v-if="activeStrategy.schema.details"
          v-html="activeStrategy.schema.details"
        ></div>
      </div>
      <div class="flex-1 bg-[#1874FF] bg-opacity-[0.04]">
        <div class="mx-auto h-full" style="max-width: 296px">
          <div class="space-y-4 py-9 h-full flex flex-col">
            <div class="flex-1">
              <div
                v-for="(component, index) in components"
                :key="index"
                class="mb-6"
              >
                <input-amount
                  v-if="component.type === 'input-with-token'"
                  :key="index"
                  :value="component.value"
                  :token-key="component.token ? component.token.key : 'eth'"
                  :token-keys="
                    component.tokenKeys
                      ? component.tokenKeys
                      : activeStrategy.getContext()['tokenKeys']
                  "
                  :error="component.error"
                  :placeholder="component.placeholder()"
                  @input="$event => component.onInput($event)"
                  @tokenKeyChanged="
                    tokenKey => {
                      component.onCustomInput({
                        token: getTokenByKey(tokenKey)
                      });
                    }
                  "
                />

                <input-amount
                  v-else-if="component.type === 'input-amount'"
                  :key="index"
                  :value="component.value"
                  :token-key="
                    component.tokenKey
                      ? component.tokenKey
                      : component.token
                      ? component.token.key
                      : 'eth'
                  "
                  :error="component.error"
                  :placeholder="component.placeholder()"
                  @input="$event => component.onInput($event)"
                />

                <SidebarContextHeading
                  v-else-if="component.type === 'heading'"
                  :key="index"
                >
                  {{ component.name }}
                </SidebarContextHeading>

                <div v-else-if="component.type === 'value'" :key="index">
                  <value-display :label="component.name">
                    {{ component.value }}
                  </value-display>
                </div>

                <SidebarSectionStatus
                  v-else-if="component.type === 'status'"
                  :key="index"
                  :liquidation="component.liquidation || '0'"
                  :status="component.status || '0'"
                />
              </div>
            </div>

            <div class="mt-auto">
              <ValidationErrors
                :error-messages="error ? [error] : []"
                class="mb-6"
              />

              <ButtonCTA
                class="w-full"
                @click="submit"
                :loading="pending"
                :disabled="pending"
              >
                {{ activeStrategy.schema.submitText || "Submit" }}
              </ButtonCTA>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SidebarContextContainer>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { useSidebar } from "~/composables/useSidebar";
import { protocolStrategies, DefineStrategy } from "~/core/strategies";
import { useStrategy } from "~/composables/useStrategy";
import InputAmount from "~/components/common/input/InputAmount.vue";
import { useToken } from "~/composables/useToken";
import ButtonCTA from "~/components/common/input/ButtonCTA.vue";
import ValueDisplay from "../components/ValueDisplay.vue";
export default defineComponent({
  components: { InputAmount, ButtonCTA, ValueDisplay },
  props: {
    protocol: {
      type: String,
      required: true
    },
    strategy: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { close } = useSidebar();
    const { getTokenByKey } = useToken();

    const strategies: DefineStrategy[] =
      protocolStrategies[props.protocol] || [];

    const {
      components,
      submit,
      error,
      strategy: activeStrategy,
      pending
    } = useStrategy(
      strategies.find(strategy => strategy.id === props.strategy)
    );

    return {
      components,
      error,
      submit,
      activeStrategy,
      getTokenByKey,
      pending
    };
  }
});
</script>