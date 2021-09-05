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
              <div v-for="(input, index) in inputs" :key="index" class="mb-6">
                <input-amount
                  v-if="input.type === 'input-with-token'"
                  :key="index"
                  :value="input.value"
                  :token-key="input.token ? input.token.key : 'eth'"
                  :token-keys="
                    input.tokenKeys
                      ? input.tokenKeys
                      : activeStrategy.getContext()['tokenKeys']
                  "
                  :error="input.error"
                  :placeholder="input.placeholder()"
                  @input="$event => input.onInput($event)"
                  @tokenKeyChanged="
                    tokenKey => {
                      input.onCustomInput({
                        token: getTokenByKey(tokenKey)
                      });
                    }
                  "
                />
                <SidebarContextHeading
                  v-else-if="input.type === 'heading'"
                  :key="index"
                >
                  {{ input.name }}
                </SidebarContextHeading>

                <div v-else-if="input.type === 'value'" :key="index">
                  <value-display :label="input.name">
                    {{ input.value }}
                  </value-display>
                </div>
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
      inputs,
      submit,
      error,
      strategy: activeStrategy,
      pending
    } = useStrategy(
      strategies.find(strategy => strategy.id === props.strategy)
    );

    return {
      inputs,
      error,
      submit,
      activeStrategy,
      getTokenByKey,
      pending
    };
  }
});
</script>