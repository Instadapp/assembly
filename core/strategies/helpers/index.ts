import DSA, { Spell } from "dsa-connect";
import Web3 from "web3";
import slugify from "slugify";
import { Strategy } from "./strategy";
import BigNumber from "bignumber.js";
import tokenIdMapping from "~/constant/tokenIdMapping";

export interface IStrategyContext {
  dsa: DSA;
  web3: Web3;
  inputs: IStrategyInput<StrategyInputType>[];



  // TODO: add types in useStrategy.ts
  dsaBalances?: { [address: string]: IStrategyToken };
  userBalances?: { [address: string]: IStrategyToken };
  tokens?: { [address: string]: IStrategyToken };
  convertTokenAmountToWei?: (value: any, decimals: any) => string;
  getTokenByKey?: (key: string) => IStrategyToken;
  position?: any;
  variables?: { [key: string]: any };
  toBN?: (value: any) => BigNumber;
  tokenIdMapping?: typeof tokenIdMapping;
  
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

  variables?: { [key: string]: any };

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

  defaults?: (context: Omit<IStrategyContext, "inputs">) => object;

  value?: any;

  [key: string]: any;
}

export enum StrategyProtocol {
  AAVE_V2 = "aaveV2",
  COMPOUND = "compound",
  MAKERDAO = "makerdao",
  LIQUITY = "liquity"
}
export interface IStrategy {
  protocol: StrategyProtocol;
  id?: string;
  name: string;
  description: string;
  details?: string;
  author?: string;

  inputs: IStrategyInput<StrategyInputType>[];

  variables?: object;

  spells: (context: IStrategyContext) => Promise<Spell[]> | Spell[];
  validate?: (
    context: IStrategyContext
  ) => Promise<void | string> | void | string;

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
