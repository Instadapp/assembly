import DSA from "dsa-connect";
import Web3 from "web3";
import { DefineStrategy, IStrategyContext } from ".";

export class Strategy {
  schema: DefineStrategy;
  inputs = [];
  context = {
    web3: null,
    dsa: null
  };

  listeners = [];

  props: object = {
    prices: {},
    dsaTokens: {},
    userTokens: {}
  };

  constructor(schema: DefineStrategy) {
    this.schema = schema;

    this.inputs = this.schema.inputs;
  }

  getContext(): IStrategyContext {
    return {
      ...this.context,
      ...this.props,
      inputs: this.getInputs()
    };
  }

  setProps(props: object) {
    Object.assign(this.props, props);
  }

  getInputs() {
    return this.inputs.map(input => ({
      ...input,
      value: input.value || "",
      error: input.error || "",
      placeholder: () =>
        input.placeholder
          ? input.placeholder({
              ...this.context,
              inputs: this.inputs,
              input: {
                token: {
                  // todo
                },
                ...input
              }
            })
          : null,
      onInput: (val: any) => {
        input.error = "";
        input.value = val;

        if (val) {
          input.error = input.validate({
            ...this.getContext(),
            input
          });
        }

        this.notifyListeners();
      },
      onCustomInput: (values: object) => {
        // input = Object.assign(input, values);

        input.error = input.validate({
          ...this.getContext(),
          input
        });
        this.notifyListeners();
      }
    }));
  }

  async submit(options) {
    await this.validate();

    const allSpells = await this.schema.spells(this.getContext());

    const spells = this.context.dsa.Spell();

    console.log(allSpells);

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
    const inputs = this.getInputs();

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
  }

  setWeb3(web3: Web3) {
    this.context.web3 = web3;
  }

  setDSA(dsa: DSA) {
    this.context.dsa = dsa;
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
