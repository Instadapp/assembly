import DSA from "dsa-connect";
import Web3 from "web3";

export interface IStrategyContext {
  dsa: typeof DSA;
  web3: Web3;
  inputs: IStrategyInput[];
}

export interface IStrategyToken {
  address: string
  key: string
  symbol: string
  balance: string

  supply: string
  borrow: string
}

export enum StrategyInputType {
  INPUT = "input",
  INPUT_WITH_TOKEN = "input-with-token"
}

export interface IStrategyInput {
  type: StrategyInputType;
  name: string;
  placeholder:
    | string
    | ((context: IStrategyContext & { input: IStrategyInput }) => string);
  validate?: ((context: IStrategyContext & { input: IStrategyInput }) => boolean|string);
  // If type is "input-with-token", this is the token
  token?: IStrategyToken;
  value?: any;
}

export interface IStrategy {
  name: string;
  description: string;
  author?: string;

  inputs: IStrategyInput[];

  spells: (context: IStrategyContext) => any;
}

export function defineStrategy(strategy: IStrategy): IStrategy {
  return strategy;
}
