import DSA from "dsa-connect";
import Web3 from "web3";
import { DefineStrategy, IStrategyContext } from ".";

export class Strategy {
  schema: DefineStrategy;
  components = [];
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

    this.components = this.generateComponents(this.schema.components);
  }

  getBaseContext(): Omit<IStrategyContext, "components"> {
    return {
      ...this.context,
      ...this.props,
      variables: this.schema.variables || {}
    };
  }

  getContext(): IStrategyContext {
    return {
      ...this.getBaseContext(),
      components: this.components
    };
  }

  setProps(props: object) {
    Object.assign(this.props, props);

    const components = this.components;

    for (const component of components) {
      if (typeof component.defaults !== "function") {
        continue;
      }

      if (component.defaulted) {
        continue;
      }

      Object.assign(component, component.defaults(this.getBaseContext()));

      component.defaulted = true;
    }

    this.notifyListeners();
  }

  generateComponents(components) {
    return components.map((component, idx) => {
      const computedComponent = {
        ...component,
        value: component.value || "",
        error: component.error || "",
        placeholder: () => {
          return component.placeholder
            ? component.placeholder({
                ...this.getContext(),
                component: this.components[idx]
              })
            : null;
        },
        onInput: (val: any) => {
          this.components[idx].error = "";
          this.components[idx].value = val;

          if (val) {
            this.components[idx].error = this.components[idx].validate({
              ...this.getContext(),
              component: this.components[idx]
            });
          }

          this.notifyListeners();
        },
        onCustomInput: (values: object) => {
          this.components[idx] = Object.assign(this.components[idx], values);

          this.components[idx].error = this.components[idx].validate({
            ...this.getContext(),
            component: this.components[idx]
          });
          this.notifyListeners();
        }
      };

      let defaults = {};

      if (component.defaults) {
        defaults = component.defaults(this.getBaseContext());
      }

      return {
        ...computedComponent,
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
    const components = this.components;

    for (const component of components) {
      if (typeof component.validate !== "function") {
        continue;
      }

      const result = await component.validate({
        ...this.getContext(),
        component
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

    this.components.forEach(component =>
      component.update?.({
        ...this.getContext(),
        component
      })
    );
  }

  onUpdated(cb) {
    this.listeners.push(cb);
  }
}
