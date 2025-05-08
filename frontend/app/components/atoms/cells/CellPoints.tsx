import { type Currency, PairType } from "@towerfi/types";
import type React from "react";

interface Props {
  assets: Currency[];
  poolType: string;
  className?: string;
}

const EBABY_ADDRESS = "bbn1s7jzz7cyuqmy5xpr07yepka5ngktexsferu2cr4xeww897ftj77sv30f5s";
const BABY = "ubbn";

// Union assets with their multipliers
const UNION_ASSETS: Record<string, number> = {
  bbn1fkz8dcvsqyfy3apfh8ufexdn4ag00w5jts99zjw9nkjue0zhs4ts6hfdz2: 1.0, // uniBTC
  bbn1z5gne4pe84tqerdrjta5sp966m98zgg5czqe4xu2yzxqfqv5tfkqed0jyy: 1.0, // LBTC
  bbn1tyvxlr8qjt7yx48lhhle7xzxfxkyqwzkaxey3jekrl0gql260jlqlxgfst: 1.0, // SolvBTC
  bbn1jr0xpgy90hqmaafdq3jtapr2p63tv59s9hcced5j4qqgs5ed9x7sr3sv0d: 1.0, // PumpBTC
  bbn1ccylwef8yfhafxpmtzq4ps24kxce9cfnz0wnkucsvf2rylfh0jzswhk5ks: 1.0, // stBTC
  bbn1j2nchmpuhkq0yj93g84txe33j5lhw2y7p3anhqjhvamqxsev6rmsneu85x: 1.5, //satuniBTC
};

const SATLAYER_ASSETS: Record<string, number> = {
  bbn17y5zvse30629t7r37xsdj73xsqp7qsdr7gpnh966wf5aslpn66rq5ekwsz: 2.0, // uniBTC
  bbn1j2nchmpuhkq0yj93g84txe33j5lhw2y7p3anhqjhvamqxsev6rmsneu85x: 2.5, //satuniBTC.e
};

export const CellPoints: React.FC<Props> = ({ assets, poolType, className }) => {
  const [token0, token1] = assets;

  const hasEBaby = token0.denom === EBABY_ADDRESS || token1.denom === EBABY_ADDRESS;
  const hasUnion = UNION_ASSETS[token0.denom] || UNION_ASSETS[token1.denom];
  const hasUnionOrEscher =
    hasUnion ||
    (token0.denom === EBABY_ADDRESS && token1.denom === BABY) ||
    (token0.denom === BABY && token1.denom === EBABY_ADDRESS);
  const hasSatlayer = SATLAYER_ASSETS[token0.denom] || SATLAYER_ASSETS[token1.denom];

  // Calculate average multiplier for Union assets
  const getUnionMultiplier = () => {
    const multipliers = [];
    if (UNION_ASSETS[token0.denom]) multipliers.push(UNION_ASSETS[token0.denom]);
    if (UNION_ASSETS[token1.denom]) multipliers.push(UNION_ASSETS[token1.denom]);

    // Special case for eBABY/BABY pool
    if (
      (token0.denom === EBABY_ADDRESS && token1.denom === BABY) ||
      (token0.denom === BABY && token1.denom === EBABY_ADDRESS)
    ) {
      return 1.25;
    }

    if (hasEBaby) multipliers.push(1.5);

    // Special case for eBABY/BABY pool
    if (
      (token0.denom === EBABY_ADDRESS && token1.denom === BABY) ||
      (token0.denom === BABY && token1.denom === EBABY_ADDRESS)
    ) {
      return 1.25;
    }

    if (hasEBaby) multipliers.push(1.5);

    if (multipliers.length === 0) return 0;
    return (multipliers.reduce((a, b) => a + b, 0) / multipliers.length) * 2;
  };

  const unionMultiplier = getUnionMultiplier();

  // Determine which Union logo to show based on multiplier
  const getUnionLogo = () => {
    if (unionMultiplier >= 3.75) return "/union/3.75x.svg";
    if (unionMultiplier >= 2.5) return "/union/2.5x.svg";
    if (unionMultiplier >= 2.0) return "/union/2x.svg";
    if (unionMultiplier >= 1.5) return "/union/1.5x.svg";
    if (unionMultiplier >= 1.25) return "/union/1.25x.svg";
    return "/union/1x.svg";
  };

  const getTowerMultiplier = (): number => {
    const multiplier = poolType === "concentrated" ? 2 : 1;
    if (hasUnion) {
      return multiplier + 0.5;
    }
    return multiplier;
  };

  const towerMultiplier = getTowerMultiplier();

  // Determine which Union logo to show based on multiplier
  const getTowerLogo = () => {
    if (towerMultiplier >= 2.5) return "/tower/2.5x.svg";
    if (towerMultiplier >= 2.0) return "/tower/2x.svg";
    if (towerMultiplier >= 1.5) return "/tower/1.5x.svg";
    if (towerMultiplier >= 1.0) return "/tower/1x.svg";
    return "/favicon.svg";
  };

  const getSatlayerMultiplier = () => {
    // TODO add logic to differentiate between 2x and 2.5x
    return 2.0;
  };

  const satlayerMultiplier = getSatlayerMultiplier();

  const getSatLayerLogo = () => {
    if (satlayerMultiplier >= 2.5) return "/satlayer/2.5x.svg";
    if (satlayerMultiplier >= 2.0) return "/satlayer/2x.svg";
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-0">
        {/* Tower Points - Always shown */}
        <div className="flex items-center gap-1">
          <img src={getTowerLogo()} alt="TowerFi" className="w-auto h-7 overflow-x-auto" />
        </div>

        {/* EBaby Points */}
        {hasEBaby && (
          <div className="flex items-center gap-1 overflow-x-auto">
            <img
              src="/escher/2.5x_no_background_all_white.svg"
              alt="EBaby"
              className="w-auto h-7 flex-shrink-0 overflow-x-auto"
            />
          </div>
        )}

        {/* Union Points */}
        {hasUnionOrEscher && (
          <div className="flex items-center gap-1 overflow-x-auto">
            <img
              src={getUnionLogo()}
              alt={`Union ${unionMultiplier}x`}
              className="h-6 w-auto flex-shrink-0 overflow-x-auto"
            />
          </div>
        )}

        {/* Satlayer point */}
        {hasSatlayer && (
          <div className="flex items-center gap-1 overflow-x-auto">
            <img
              src={getSatLayerLogo()}
              alt={`SatLayer ${satlayerMultiplier}x`}
              className="h-8 w-auto flex-shrink-0 overflow-x-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};
