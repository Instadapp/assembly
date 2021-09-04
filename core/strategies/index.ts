import AaveV2 from "./protocols/aave-v2"
import Compound from "./protocols/compound"

export const protocolStrategies = {
    aaveV2 : AaveV2,
    compound : Compound,
}

export * from "./helpers"