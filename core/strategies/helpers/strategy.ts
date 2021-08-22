import DSA from "dsa-connect";
import Web3 from "web3";
import slugify from "slugify"
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

// type InputTypes  = {
//   [StrategyInputType.INPUT] : {
//     token?: IStrategyToken;
//     value?: any;
//   };
// }

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

  [key: string]: any;
}

export interface IStrategy {
  id?: string;
  name: string;
  description: string;
  author?: string;

  inputs: IStrategyInput[];

  spells: (context: IStrategyContext) => any;

  submitText?: string;
}

export function defineStrategy(strategy: IStrategy): IStrategy {

  if(! strategy.id){
    strategy.id = slugify(strategy.name).toLowerCase();
  }

  return strategy;
}
