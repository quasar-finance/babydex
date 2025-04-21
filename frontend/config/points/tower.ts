import type { PoolInfo } from "@towerfi/types";

interface CalculatorInputs {
  fdv: string;
  tokenSupply: string;
  pool: PoolInfo;
}

interface CalculatorOutputs {
  pointsPerHour: number;
  usdValuePerPoint: number;
  apr: number;
}

export const USD_PER_POINT = 1000;
export const HOURS_PER_YEAR = 24 * 365;

export const getPointsRate = (poolType: string) => {
  return poolType === 'concentrated' ? 2.5 : 1;
};

export const calculateTowerPoints = (inputs: CalculatorInputs): CalculatorOutputs => {
  const fdvValue = parseFloat(inputs.fdv.replace('M', '')) * 1000000;
  const tokenSupplyValue = parseFloat(inputs.tokenSupply);
  const pointsRate = getPointsRate(inputs.pool.poolType);
  
  const usdValuePerPoint = fdvValue / tokenSupplyValue;
  const pointsPerYear = pointsRate * HOURS_PER_YEAR;
  const apr = (pointsPerYear * usdValuePerPoint) / USD_PER_POINT;

  return {
    pointsPerHour: pointsRate,
    usdValuePerPoint,
    apr
  };
}; 