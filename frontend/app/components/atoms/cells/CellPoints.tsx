import { Currency } from "@towerfi/types";
import type React from "react";
import { SATLAYER_ASSETS } from "~/config/points/satlayer";
import { EBABY_ADDRESS, UNION_ASSETS, getUnionMultiplier, getUnionLogo } from "~/config/points/union";

interface Props {
  assets: Currency[];
  className?: string;
}

export const CellPoints: React.FC<Props> = ({ assets, className }) => {
  const [token0, token1] = assets;
  
  const hasEBaby = token0.denom === EBABY_ADDRESS || token1.denom === EBABY_ADDRESS;
  const hasUnion = UNION_ASSETS[token0.denom] || UNION_ASSETS[token1.denom];
  const hasSatlayer = SATLAYER_ASSETS[token0.denom] || SATLAYER_ASSETS[token1.denom];
  
  const unionMultiplier = getUnionMultiplier(token0.denom, token1.denom, hasEBaby);
  
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
              src="/escher/logo.svg" 
              alt="EBaby" 
              className="w-5 h-5"
            />
          </div>
        )}
        
        {/* Union Points */}
        {hasUnion && (
          <div className="flex items-center gap-1">
            <img 
              src={getUnionLogo(unionMultiplier)} 
              alt={`Union ${unionMultiplier}x`} 
              className="h-6 w-auto"
            />
          </div>
        )}

        {/* Satlayer point */}
        {hasSatlayer && (
          <div className="flex items-center gap-1">
            <img 
              src={getSatLayerLogo()} 
              alt={`SatLayer ${satlayerMultiplier}x`} 
              className="h-8 w-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}; 