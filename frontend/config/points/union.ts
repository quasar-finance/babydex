import { EBABY_ADDRESS } from "./escher";

// Union assets with their multipliers
export const UNION_ASSETS: Record<string, number> = {
  "bbn1fkz8dcvsqyfy3apfh8ufexdn4ag00w5jts99zjw9nkjue0zhs4ts6hfdz2": 1.0, // uniBTC
  "bbn1z5gne4pe84tqerdrjta5sp966m98zgg5czqe4xu2yzxqfqv5tfkqed0jyy": 1.0, // LBTC
  "bbn1tyvxlr8qjt7yx48lhhle7xzxfxkyqwzkaxey3jekrl0gql260jlqlxgfst": 1.0, // SolvBTC
  "bbn1jr0xpgy90hqmaafdq3jtapr2p63tv59s9hcced5j4qqgs5ed9x7sr3sv0d": 1.0, // PumpBTC
  "bbn1ccylwef8yfhafxpmtzq4ps24kxce9cfnz0wnkucsvf2rylfh0jzswhk5ks": 1.0, // stBTC
  "bbn1j2nchmpuhkq0yj93g84txe33j5lhw2y7p3anhqjhvamqxsev6rmsneu85x": 1.5, //sat.uniBTC
  EBABY_ADDRESS: 1.0,
};

export const getPointsRate = (token0: string, token1: string, hasEBaby: boolean) => {
  const multipliers = [];
  if (UNION_ASSETS[token0]) multipliers.push(UNION_ASSETS[token0]);
  if (UNION_ASSETS[token1]) multipliers.push(UNION_ASSETS[token1]);
  if (hasEBaby) multipliers.push(1.5);
  
  if (multipliers.length === 0) return 0;
  return multipliers.reduce((a, b) => a + b, 0) / multipliers.length * 2;
};

export const calculateTowerPoints = (inputs: CalculatorInputs): CalculatorOutputs => {

}

export const getUnionLogo = (multiplier: number) => {
  if (multiplier >= 3.75) return "/union/3.75x.svg";
  if (multiplier >= 2.5) return "/union/2.5x.svg";
  if (multiplier >= 2.0) return "/union/2x.svg";
  if (multiplier >= 1.5) return "/union/1.5x.svg";
  if (multiplier >= 1.25) return "/union/1.25x.svg";
  return "/union/1x.svg";
