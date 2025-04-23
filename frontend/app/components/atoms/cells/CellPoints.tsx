import { Currency } from "@towerfi/types";
import type React from "react";

interface Props {
  assets: Currency[];
  className?: string;
}

const EBABY_ADDRESS = "bbn1s7jzz7cyuqmy5xpr07yepka5ngktexsferu2cr4xeww897ftj77sv30f5s";

// Union assets with their multipliers
const UNION_ASSETS: Record<string, number> = {
  "bbn1fkz8dcvsqyfy3apfh8ufexdn4ag00w5jts99zjw9nkjue0zhs4ts6hfdz2": 1.0, // uniBTC
  "bbn1z5gne4pe84tqerdrjta5sp966m98zgg5czqe4xu2yzxqfqv5tfkqed0jyy": 1.0, // LBTC
  "bbn1tyvxlr8qjt7yx48lhhle7xzxfxkyqwzkaxey3jekrl0gql260jlqlxgfst": 1.0, // SolvBTC
  "bbn1jr0xpgy90hqmaafdq3jtapr2p63tv59s9hcced5j4qqgs5ed9x7sr3sv0d": 1.0, // PumpBTC
  "bbn1ccylwef8yfhafxpmtzq4ps24kxce9cfnz0wnkucsvf2rylfh0jzswhk5ks": 1.0, // stBTC
  "bbn1j2nchmpuhkq0yj93g84txe33j5lhw2y7p3anhqjhvamqxsev6rmsneu85x": 1.5, //sat.uniBTC
  EBABY_ADDRESS: 1.0,
};


export const CellPoints: React.FC<Props> = ({ assets, className }) => {
  const [token0, token1] = assets;
  
  const hasEBaby = token0.denom === EBABY_ADDRESS || token1.denom === EBABY_ADDRESS;
  const hasUnion = UNION_ASSETS[token0.denom] || UNION_ASSETS[token1.denom];
  
  // Calculate average multiplier for Union assets
  const getUnionMultiplier = () => {
    const multipliers = [];
    if (UNION_ASSETS[token0.denom]) multipliers.push(UNION_ASSETS[token0.denom]);
    if (UNION_ASSETS[token1.denom]) multipliers.push(UNION_ASSETS[token1.denom]);
    if (hasEBaby) multipliers.push(1.5);
    
    if (multipliers.length === 0) return 0;
    return multipliers.reduce((a, b) => a + b, 0) / multipliers.length * 2;
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
  
  return (
    <div className={className}>
      <div className="flex items-center gap-2 relative">
        {/* Tower Points - Always shown */}
        <div className="flex items-center gap-1">
          <img 
            src="/favicon.png" 
            alt="TowerFi" 
            className="w-5 h-5"
          />
        </div>
        
        {/* EBaby Points */}
        {hasEBaby && (
          <div className="flex items-center gap-1">
            <img 
              src="https://raw.githubusercontent.com/cosmos/chain-registry/master/babylon/images/eBABY.svg" 
              alt="EBaby" 
              className="w-5 h-5"
            />
          </div>
        )}
        
        {/* Union Points */}
        {hasUnion && (
          <div className="flex items-center gap-1">
            <img 
              src={getUnionLogo()} 
              alt={`Union ${unionMultiplier}x`} 
              className="h-6 w-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}; 