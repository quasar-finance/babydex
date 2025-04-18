import { Currency } from "@towerfi/types";
import type React from "react";

interface Props {
  assets: Currency[];
  className?: string;
}

const UNION_ASSETS = [
  "bbn1fkz8dcvsqyfy3apfh8ufexdn4ag00w5jts99zjw9nkjue0zhs4ts6hfdz2", // uniBTC
  "bbn1z5gne4pe84tqerdrjta5sp966m98zgg5czqe4xu2yzxqfqv5tfkqed0jyy", // LBTC
  "bbn1tyvxlr8qjt7yx48lhhle7xzxfxkyqwzkaxey3jekrl0gql260jlqlxgfst", // SolvBTC
  "bbn1jr0xpgy90hqmaafdq3jtapr2p63tv59s9hcced5j4qqgs5ed9x7sr3sv0d", // PumpBTC
  "bbn1ccylwef8yfhafxpmtzq4ps24kxce9cfnz0wnkucsvf2rylfh0jzswhk5ks", // stBTC
];

const EBABY_ADDRESS = "bbn1s7jzz7cyuqmy5xpr07yepka5ngktexsferu2cr4xeww897ftj77sv30f5s";

export const CellPoints: React.FC<Props> = ({ assets, className }) => {
  const [token0, token1] = assets;
  
  const hasEBaby = token0.denom === EBABY_ADDRESS || token1.denom === EBABY_ADDRESS;
  const hasUnion = UNION_ASSETS.includes(token0.denom) || UNION_ASSETS.includes(token1.denom);
  
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {/* Tower Points - Always shown */}
        <div className="flex items-center gap-1">
          <img 
            src="/favicon.png" 
            alt="TowerFi" 
            className="w-5 h-5"
          />
          <span className="text-sm"></span>
        </div>
        
        {/* EBaby Points */}
        {hasEBaby && (
          <div className="flex items-center gap-1">
            <img 
              src="https://raw.githubusercontent.com/cosmos/chain-registry/master/babylon/images/eBABY.svg" 
              alt="EBaby" 
              className="w-5 h-5"
            />
            <span className="text-sm"></span>
          </div>
        )}
        
        {/* Union Points */}
        {true &&  (
          <div className="flex items-center gap-1">
            <img 
              src="/union-logo.svg" 
              alt="Union" 
              className="w-5 h-5"
            />
            <span className="text-sm"></span>
          </div>
        )}
      </div>
    </div>
  );
}; 