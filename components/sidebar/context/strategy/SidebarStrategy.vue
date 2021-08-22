<template>
  <SidebarContextContainer class="h-full overflow-hidden">
    <SidebarContextHeader class="xxl:hidden">Strategy</SidebarContextHeader>

    <div class="h-full overflow-y-scroll scrollbar-hover">
      <div class="mx-auto" style="max-width: 296px">
        <div class="py-2 sm:py-4">
          <div v-for="(input, index) in inputs" :key="index">
            <input-amount
              :key="index"
              :value="input.value"
              :token-key="input.token ? input.token.key : 'eth'"
              :token-keys="input.tokenKeys ? input.tokenKeys : activeStrategy.getContext()['tokenKeys']"
              :placeholder="input.placeholder()"
              :error="input.error"
              @input="$event => input.onInput($event)"
              @tokenKeyChanged="
                tokenKey => {
                  input.onCustomInput({
                    token: getTokenByKey(tokenKey)
                  });
                }
              "
            />
          </div>

          <button @click="submit">Submit</button>

          {{ error }}
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

export default defineComponent({
  components: { InputAmount },
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

    const { inputs, submit, error, strategy : activeStrategy} = useStrategy(
      strategies.find(strategy => strategy.id === props.strategy)
    );

    return {
      inputs,
      error,
      submit,
      activeStrategy,
      getTokenByKey,
    };
  }
});
</script>