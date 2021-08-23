import DSA, { Spell } from "dsa-connect";
import Web3 from "web3";
import slugify from "slugify";
import { Strategy } from "./strategy";
export interface IStrategyContext {
  dsa: DSA;
  web3: Web3;
  inputs: IStrategyInput<StrategyInputType>[];
  dsaTokens?: { [address: string]: IStrategyToken };
  userTokens?: { [address: string]: IStrategyToken };
}

export interface IStrategyToken {
  address: string;
  key: string;
  symbol: string;
  balance: string;

  // supply: string;
  // borrow: string;
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
  placeholder?: (
    context: IStrategyContext & {
      input: IStrategyInput<InputType> & StrategyInputParameterMap[InputType];
    }
  ) => string;
  validate?: (
    context: IStrategyContext & {
      input: IStrategyInput<InputType> & StrategyInputParameterMap[InputType];
    }
  ) => string | void;

  defaults?: (context: Omit<IStrategyContext, 'inputs'>) => object;
  
  value?: any;

  [key: string]: any;
}

export interface IStrategy {
  id?: string;
  name: string;
  description: string;
  author?: string;

  inputs: IStrategyInput<StrategyInputType>[];

  spells: (context: IStrategyContext) => Promise<Spell[]> | Spell[];

  submitText?: string;
}

export function defineInput<InputType extends StrategyInputType>(
  input: IStrategyInput<InputType>
) {
  return input as IStrategyInput<InputType>;
}

export function defineStrategy(strategy: IStrategy) {
  return {
    ...strategy,
    id: strategy.id ? strategy.id : slugify(strategy.name).toLowerCase()
  };
}

export function buildStrategy(schema: DefineStrategy) {
  return new Strategy(schema);
}

export type DefineStrategy = ReturnType<typeof defineStrategy>;
