import DSA from "dsa-connect";
import Web3 from "web3";
import { DefineStrategy, IStrategyContext } from ".";

export class Strategy {
  schema: DefineStrategy;
  inputs = [];
  context = {
    web3: null as Web3,
    dsa: null as DSA
  };

  listeners = [];

  props: object = {
    prices: {},
    dsaTokens: {},
    userTokens: {}
  };

  constructor(schema: DefineStrategy) {
    this.schema = schema;

    this.inputs = this.generateInputs(this.schema.inputs);
  }

  getBaseContext(): Omit<IStrategyContext, "inputs"> {
    return {
      ...this.context,
      ...this.props,
      variables: this.schema.variables || {}
    };
  }

  getContext(): IStrategyContext {
    return {
      ...this.getBaseContext(),
      inputs: this.inputs
    };
  }

  setProps(props: object) {
    Object.assign(this.props, props);

    const inputs = this.inputs;

    for (const input of inputs) {
      if (typeof input.defaults !== "function") {
        continue;
      }

      if (input.defaulted) {
        continue;
      }

      Object.assign(input, input.defaults(this.getBaseContext()));

      input.defaulted = true;
    }

    this.notifyListeners();
  }

  generateInputs(inputs) {
    return inputs.map((input, idx) => {
      const computedInput = {
        ...input,
        value: input.value || "",
        error: input.error || "",
        placeholder: () => {
          return input.placeholder
            ? input.placeholder({
                ...this.getContext(),
                input: this.inputs[idx]
              })
            : null;
        },
        onInput: (val: any) => {
          this.inputs[idx].error = "";
          this.inputs[idx].value = val;

          if (val) {
            this.inputs[idx].error = this.inputs[idx].validate({
              ...this.getContext(),
              input: this.inputs[idx]
            });
          }

          this.notifyListeners();
        },
        onCustomInput: (values: object) => {
          this.inputs[idx] = Object.assign(this.inputs[idx], values);

          this.inputs[idx].error = this.inputs[idx].validate({
            ...this.getContext(),
            input: this.inputs[idx]
          });
          this.notifyListeners();
        }
      };

      let defaults = {};

      if (input.defaults) {
        defaults = input.defaults(this.getBaseContext());
      }

      return {
        ...computedInput,
        ...defaults
      };
    });
  }

  async spells() {
    return await this.schema.spells(this.getContext());
  }

  async submit(options) {
    await this.validate();

    const allSpells = await this.spells();

    const spells = this.context.dsa.Spell();

    for (const spell of allSpells) {
      spells.add(spell);
    }

    return await this.context.dsa.cast({
      spells,
      onReceipt: options?.onReceipt,
      from: options?.from
    });
  }

  async validate() {
    const inputs = this.inputs;

    for (const input of inputs) {
      if (typeof input.validate !== "function") {
        continue;
      }

      const result = await input.validate({
        ...this.getContext(),
        input
      });

      if (typeof result === "string") {
        throw new Error(result || "Error has occurred");
      }
    }

    if (this.schema.validate) {
      const result = await this.schema.validate(this.getContext());

      if (typeof result === "string") {
        throw new Error(result || "Error has occurred");
      }
    }
  }

  setWeb3(web3: Web3) {
    this.context.web3 = web3;

    this.notifyListeners();
  }

  setDSA(dsa: DSA) {
    this.context.dsa = dsa;

    this.notifyListeners();
  }

  async notifyListeners() {
    for (const listener of this.listeners) {
      await listener(this);
    }
  }

  onUpdated(cb) {
    this.listeners.push(cb);
  }
}
