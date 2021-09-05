import DSA, { Spell } from "dsa-connect";
import Web3 from "web3";
import slugify from "slugify";
import { Strategy } from "./strategy";
import BigNumber from "bignumber.js";
import tokenIdMapping from "~/constant/tokenIdMapping";
import { useFormatting } from "~/composables/useFormatting";
export interface IStrategyContext {
  dsa: DSA;
  web3: Web3;
  components: IStrategyComponent<StrategyComponentType>[];

  // TODO: add types in useStrategy.ts
  dsaBalances?: { [address: string]: IStrategyToken };
  userBalances?: { [address: string]: IStrategyToken };
  tokens?: { [address: string]: IStrategyToken };
  convertTokenAmountToWei?: (value: any, decimals: any) => string;
  getTokenByKey?: (key: string) => IStrategyToken;
  position?: any;
  positionExtra?: { [key: string]: any };
  variables?: { [key: string]: any };
  toBN?: (value: any) => BigNumber;
  tokenIdMapping?: typeof tokenIdMapping;
  formatting?: ReturnType<typeof useFormatting>;
}

export interface IStrategyToken {
  address: string;
  key: string;
  symbol: string;
  balance: string;
  decimals: string;

  // supply: string;
  // borrow: string;
}

export enum StrategyComponentType {
  // INPUT = "input",
  INPUT_NUMERIC = "input-numeric",
  INPUT_AMOUNT = "input-amount",
  INPUT_WITH_TOKEN = "input-with-token",

  HEADING = "heading",
  VALUE = "value",
  STATUS = "status",
}

export type StrategyComponentParameterMap = {
  // [StrategyInputType.INPUT]: {};

  [StrategyComponentType.INPUT_NUMERIC]: {};

  [StrategyComponentType.INPUT_AMOUNT]: {
    tokenKey: string;
  };

  [StrategyComponentType.INPUT_WITH_TOKEN]: {
    token?: IStrategyToken;
  };

  [StrategyComponentType.HEADING]: {};
  [StrategyComponentType.VALUE]: {};
  [StrategyComponentType.STATUS]: {
    liquidation?: any,
    status?: any,
  };
};

export interface IStrategyComponent<ComponentType extends StrategyComponentType> {
  type: ComponentType;
  name: string;

  variables?: { [key: string]: any };

  placeholder?: (
    context: IStrategyContext & {
      component: IStrategyComponent<ComponentType> & StrategyComponentParameterMap[ComponentType];
    }
  ) => string;
  validate?: (
    context: IStrategyContext & {
      component: IStrategyComponent<ComponentType> & StrategyComponentParameterMap[ComponentType];
    }
  ) => string | void;

  defaults?: (context: Omit<IStrategyContext, "components">) => object;
  update?: (
    context: IStrategyContext & {
      component: IStrategyComponent<ComponentType> & StrategyComponentParameterMap[ComponentType];
    }
  ) => void;

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

  components: IStrategyComponent<StrategyComponentType>[];

  variables?: object;

  spells: (context: IStrategyContext) => Promise<Spell[]> | Spell[];
  validate?: (
    context: IStrategyContext
  ) => Promise<void | string> | void | string;

  submitText?: string;
}

export function defineStrategyComponent<ComponentType extends StrategyComponentType>(
  component: IStrategyComponent<ComponentType>
) {
  return component as IStrategyComponent<ComponentType>;
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
