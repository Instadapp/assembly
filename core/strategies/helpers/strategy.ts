import DSA, { Spell } from "dsa-connect";
import Web3 from "web3";
import slugify from "slugify";
export interface IStrategyContext {
  dsa: DSA;
  web3: Web3;
  inputs: IStrategyInput<StrategyInputType>[];
}

export interface IStrategyToken {
  address: string;
  key: string;
  symbol: string;
  balance: string;

  supply: string;
  borrow: string;
}

export enum StrategyInputType {
  INPUT = "input",
  INPUT_WITH_TOKEN = "input-with-token"
}

export type StrategyInputParameterMap = {
  [StrategyInputType.INPUT]: {};

  [StrategyInputType.INPUT_WITH_TOKEN]: {
    token?: IStrategyToken;
  };
};

export interface IStrategyInput<InputType extends StrategyInputType> {
  type: InputType;
  name: string;
  placeholder: (
    context: IStrategyContext & {
      input: IStrategyInput<InputType> & StrategyInputParameterMap[InputType];
    }
  ) => string;
  validate?: (
    context: IStrategyContext & {
      input: IStrategyInput<InputType> & StrategyInputParameterMap[InputType];
    }
  ) => string | void;
  value?: any;

  [key: string]: any;
}

export interface IStrategy {
  id?: string;
  name: string;
  description: string;
  author?: string;

  inputs: IStrategyInput<any>[];

  spells: (context: IStrategyContext) => Promise<Spell[]> | Spell[];

  submitText?: string;
}

export function defineInput<InputType extends StrategyInputType>(
  input: IStrategyInput<InputType>
) {
  return input as IStrategyInput<any>;
}

export function defineStrategy(strategy: IStrategy) {
  const context = {
    web3: null,
    dsa: null
  };

  return {
    ...strategy,
    id: strategy.id ? strategy.id : slugify(strategy.name).toLowerCase(),
    inputs: strategy.inputs.map(input => ({
      ...input,
      value: null,
      placeholder: () =>
        input.placeholder
          ? input.placeholder({
              ...context,
              inputs: strategy.inputs,
              input: {
                ...input,
                token: {
                    // todo
                }
              }
            })
          : null,
      onInput: (val: any) => {
        input.value = val;
      }
    })),
    submit: async () => {
      await this.validate({
        ...context,
        inputs: strategy.inputs
      });

      const allSpells = await strategy.spells({
        ...context,
        inputs: strategy.inputs
      });

      const spells = context.dsa.Spell();

      for (const spell of allSpells) {
        spells.add(spell);
      }

      return await context.dsa.cast({
        spells,
        onReceipt: this.onReceipt
      });
    },
    validate: async () => {
      for (const input of this.inputs) {
        const result = await input.validate({
          ...context,
          inputs: strategy.inputs,
          input
        });

        if (result !== true) {
          throw new Error(result || "Error has occurred");
        }
      }
    },
    onReceipt: (txHash: string, txReceipt: any) => {
      // do something
    }
  };
}

export type DefineStrategy = ReturnType<typeof defineStrategy>;
