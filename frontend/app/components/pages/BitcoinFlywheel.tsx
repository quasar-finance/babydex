"use client";
import Input from "../atoms/Input";
import { Button } from "../atoms/Button";
import { twMerge } from "~/utils/twMerge";
import { useModal } from "~/app/providers/ModalProvider";
import { ModalTypes } from "~/types/modal";
import { trpc } from "~/trpc/client";

import type React from "react";
import PoolsSkeleton from "../molecules/skeletons/PoolsSkeleton";
import { CellPoolName } from "../atoms/cells/CellPoolName";
import { CellTVL } from "../atoms/cells/CellTVL";
import { CellData } from "../atoms/cells/CellData";
import { Table, TableRow } from "../atoms/Table";
import { useEffect, useState } from "react";
import { Pagination } from "../atoms/Pagination";
import { blockedPoolAddresses, unionFlywheelPools } from "~/utils/consts";

const columns = [
  { key: "name", title: "Pool", className: "col-span-2 lg:col-span-1" },
  { key: "poolLiquidity", title: "TVL" },
  { key: "poolApr", title: "pool APR" },
  { key: "pointsApr", title: "points APR" },
  { key: "totalApr", title: "Total APR" },
  { key: "actions", title: "" },
];

interface CalculatorInputs {
  fdv: string;
  tokenSupply: string;
}

interface ProjectCalculator {
  name: string;
  calculateAPR: (inputs: CalculatorInputs) => number;
  formatInput: (value: string) => string;
  parseInput: (value: string) => number;
}

const PROJECT_CALCULATORS: Record<string, ProjectCalculator> = {
  union: {
    name: "Union",
    calculateAPR: (inputs) => {
      const fdvValue = parseFloat(inputs.fdv.replace('M', '')) * 1000000;
      const tokenSupplyValue = parseFloat(inputs.tokenSupply);
      return fdvValue > 0 && tokenSupplyValue > 0 ? (fdvValue / tokenSupplyValue) * 100 : 0;
    },
    formatInput: (value) => {
      if (!value) return '';
      const numericValue = parseFloat(value);
      return isNaN(numericValue) ? '' : `${(numericValue / 1000000).toFixed(2)}M`;
    },
    parseInput: (value) => {
      if (!value) return 0;
      const numericValue = parseFloat(value.replace('M', ''));
      return isNaN(numericValue) ? 0 : numericValue * 1000000;
    }
  },
  tower: {
    name: "Tower",
    calculateAPR: (inputs) => {
      const fdvValue = parseFloat(inputs.fdv.replace('M', '')) * 1000000;
      const tokenSupplyValue = parseFloat(inputs.tokenSupply);
      // Tower might have a different calculation, e.g. with a multiplier
      return fdvValue > 0 && tokenSupplyValue > 0 ? (fdvValue / tokenSupplyValue) * 100 * 1.5 : 0;
    },
    formatInput: (value) => {
      if (!value) return '';
      const numericValue = parseFloat(value);
      return isNaN(numericValue) ? '' : `${(numericValue / 1000000).toFixed(2)}M`;
    },
    parseInput: (value) => {
      if (!value) return 0;
      const numericValue = parseFloat(value.replace('M', ''));
      return isNaN(numericValue) ? 0 : numericValue * 1000000;
    }
  },
  escher: {
    name: "Escher",
    calculateAPR: (inputs) => {
      const fdvValue = parseFloat(inputs.fdv.replace('M', '')) * 1000000;
      const tokenSupplyValue = parseFloat(inputs.tokenSupply);
      // Escher might have a different calculation, e.g. with a different formula
      return fdvValue > 0 && tokenSupplyValue > 0 ? (fdvValue / (tokenSupplyValue * 2)) * 100 : 0;
    },
    formatInput: (value) => {
      if (!value) return '';
      const numericValue = parseFloat(value);
      return isNaN(numericValue) ? '' : `${(numericValue / 1000000).toFixed(2)}M`;
    },
    parseInput: (value) => {
      if (!value) return 0;
      const numericValue = parseFloat(value.replace('M', ''));
      return isNaN(numericValue) ? 0 : numericValue * 1000000;
    }
  }
};

interface CalculatorState {
  [key: string]: CalculatorInputs;
}

const PRESETS = {
  bear: {
    union: { fdv: "1M", tokenSupply: "10" },
    tower: { fdv: "0.5M", tokenSupply: "20" },
    escher: { fdv: "0.25M", tokenSupply: "30" }
  },
  bull: {
    union: { fdv: "5M", tokenSupply: "10" },
    tower: { fdv: "2.5M", tokenSupply: "20" },
    escher: { fdv: "1.25M", tokenSupply: "30" }
  },
  custom: {
    union: { fdv: "", tokenSupply: "" },
    tower: { fdv: "", tokenSupply: "" },
    escher: { fdv: "", tokenSupply: "" }
  }
};

const Pools: React.FC = () => {
  const { showModal } = useModal();
  const gridClass = "grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-3";
  const { data: pools = [], isLoading } = trpc.local.pools.getPools.useQuery({
    limit: 100,
  });

  const [calculatorState, setCalculatorState] = useState<CalculatorState>(PRESETS.bull);

  const handlePreset = (preset: keyof typeof PRESETS) => {
    setCalculatorState(PRESETS[preset]);
  };

  const handleInputChange = (key: string, field: keyof CalculatorInputs, value: string) => {
    const calculator = PROJECT_CALCULATORS[key];
    if (!calculator) return;

    const formattedValue = calculator.formatInput(value);
    setCalculatorState(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: formattedValue
      }
    }));
  };

  const calculateCombinedAPR = () => {
    const totalAPR = Object.entries(calculatorState).reduce((sum, [key, inputs]) => {
      const calculator = PROJECT_CALCULATORS[key];
      if (!calculator) return sum;
      return sum + calculator.calculateAPR(inputs);
    }, 0);
    return totalAPR;
  };

  const [searchText, setSearchText] = useState("");

  const filteredPools = pools
    .filter((pool) => !blockedPoolAddresses.includes(pool.poolAddress))
    .filter((pool) => unionFlywheelPools.includes(pool.poolAddress))
    .filter((pool) => pool.name.toLowerCase().includes(searchText.toLowerCase()));

  useEffect(() => {
    setCurrentPage(0);
  }, [searchText]);

  const [currentPage, setCurrentPage] = useState(0);
  const numberPerPage = 10;
  const totalPools = Math.ceil(filteredPools.length / numberPerPage);

  const sortedPools = [...filteredPools].sort(
    (a, b) => Number(b.poolLiquidity) - Number(a.poolLiquidity),
  );

  return (
    <div className="flex flex-col gap-8 px-4 pb-20 max-w-[84.5rem] mx-auto w-full min-h-[65vh] lg:pt-8">
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center lg:pl-3 lg:pr-2 pl-3">
        <h1 className="text-xl">Bitcoin Flywheel</h1>
        <div className="flex gap-3 h-[42px] items-center lg:px-2">
          <Input
            isSearch
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4 p-6 bg-white/5 rounded-xl">
          <h2 className="text-2xl font-semibold">How it Works</h2>
          <p className="text-gray-300">
            The Bitcoin Flywheel is a mechanism that allows you to earn additional rewards by providing liquidity to selected pools. 
            These pools are carefully chosen to ensure optimal returns and sustainable growth of the ecosystem.
          </p>
          <ul className="flex flex-col gap-3 list-disc list-inside text-gray-300">
            <li>Step 1: Do a thing</li>
            <li>Step 2: Do a thing</li>
            <li>Step 3: Do a thing</li>
            <li>Step 4: Do a thing</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 p-6 bg-white/5 rounded-xl">
          <h3 className="text-xl font-semibold">APR Calculator</h3>
          <div className="grid grid-cols-[80px_1fr_1fr] gap-4">
            <div></div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">FDV (USD)</label>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400">Token Supply</label>
            </div>
          </div>
          {Object.entries(calculatorState).map(([key, inputs]) => {
            const calculator = PROJECT_CALCULATORS[key];
            if (!calculator) return null;

            return (
              <div key={key} className="grid grid-cols-[80px_1fr_1fr] gap-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{calculator.name}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    type="text"
                    placeholder="Enter FDV (e.g. 1M)"
                    value={inputs.fdv}
                    onChange={(e) => handleInputChange(key, 'fdv', e.target.value)}
                    className="bg-white/5"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    type="text"
                    placeholder="Enter %"
                    value={inputs.tokenSupply}
                    onChange={(e) => handleInputChange(key, 'tokenSupply', e.target.value)}
                    className="bg-white/5"
                  />
                </div>
              </div>
            );
          })}
          <div className="mt-4 p-4 bg-white/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Combined Estimated APR</span>
              <span className="text-2xl font-semibold">
                {calculateCombinedAPR().toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              variant="flat"
              onPress={() => handlePreset('bear')}
              className="bg-gray-500/20 hover:bg-gray-500/30"
            >
              Bear Case
            </Button>
            <Button
              variant="flat"
              onPress={() => handlePreset('bull')}
              className="bg-yellow-500/20 hover:bg-yellow-500/30"
            >
              Bull Case
            </Button>
            <Button
              variant="flat"
              onPress={() => handlePreset('custom')}
              className="bg-gray-500/20 hover:bg-gray-500/30"
            >
              Custom
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center lg:pl-3 lg:pr-2 pl-3">
        <h2 className="text-xl">Available Pools</h2>
      </div>

      <Table columns={columns} gridClass={gridClass}>
        {isLoading && <PoolsSkeleton className={twMerge("grid", gridClass)} />}
        {sortedPools
          .slice(currentPage * numberPerPage, currentPage * numberPerPage + numberPerPage)
          .map((pool, i) => (
            <TableRow key={i} gridClass={twMerge("grid", gridClass)}>
              <CellPoolName
                assets={pool.assets}
                name={pool.name}
                poolType={pool.poolType}
                config={pool.config}
              />
              <CellTVL
                poolLiquidity={pool.poolLiquidity}
                poolAddress={pool.poolAddress}
                assets={pool.assets}
              />
              <CellData title="Points APR" data="80%" />
              <CellData title="Pool APR" data="20%" />
              <CellData title="Total APR" data="100%" />
              <div className="flex items-center justify-end">
                <Button
                  variant="flat"
                  onPress={() => showModal(ModalTypes.add_liquidity, false, { pool })}
                >
                  Add Liquidity
                </Button>
              </div>
            </TableRow>
          ))}
      </Table>
      {filteredPools.length > numberPerPage && (
        <Pagination
          total={totalPools}
          onPageChange={(page) => setCurrentPage(page - 1)}
          initialPage={currentPage + 1}
          className={{ base: "self-center backdrop-blur-xl rounded-3xl p-1" }}
        />
      )}
    </div>
  );
};

export default Pools;
