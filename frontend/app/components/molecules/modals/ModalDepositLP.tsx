import { useState } from "react";
import { Button } from "~/app/components/atoms/Button";
import BasicModal from "~/app/components/templates/BasicModal";
import { twMerge } from "~/utils/twMerge";
import { motion } from "motion/react";
import { IconChevronDown, IconWallet } from "@tabler/icons-react";
import IconCoins from "~/app/components/atoms/icons/IconCoins";
import Divider from "~/app/components/atoms/Divider";
import { useToast } from "~/app/hooks";
import { convertMicroDenomToDenom, convertDenomToMicroDenom } from "~/utils/intl";

import { useForm } from "react-hook-form";

import type { PoolInfo } from "@towerfi/types";
import { useAccount, useBalances, useSigningClient } from "@cosmi/react";

interface ModalDepositLPProps {
  pool: PoolInfo;
}

const ModalDepositLP: React.FC<ModalDepositLPProps> = ({ pool }) => {
  const { assets, name } = pool;
  const [token0, token1] = assets;
  const [side, setSide] = useState<"double" | "single">("double");
  const [slipageTolerance, setSlipageTolerance] = useState("0.1");
  const [singleSideToken, setSingleSideToken] = useState(token0.symbol);
  const { address, connector } = useAccount();
  const { data: signingClient } = useSigningClient();

  const { handleSubmit, register, formState, watch, setValue } = useForm();
  const { toast } = useToast();
  const { errors, isLoading, isSubmitSuccessful } = formState;

  const { data: balances = [], refetch: refreshBalances } = useBalances({
    address: address as string,
  });

  const { t0Balance, t1Balance } = balances.reduce(
    (acc, { denom, amount }) => {
      if (denom === token0.denom) acc.t0Balance = amount;
      if (denom === token1.denom) acc.t1Balance = amount;
      return acc;
    },
    { t0Balance: "0", t1Balance: "0" },
  );

  const onSubmit = handleSubmit(async (data) => {
    if (!signingClient) throw new Error("No connector found");
    if (side === "single") {
      const tokenInfo = assets.find((asset) => asset.symbol === singleSideToken);
      if (!tokenInfo) throw new Error("Token not found");
      const tokenAmount = convertDenomToMicroDenom(data[singleSideToken], tokenInfo.decimals);
      await toast.promise(
        (async () => {
          await signingClient.execute({
            execute: {
              address: pool.poolAddress,
              message: {
                provide_liquidity: {
                  assets: [
                    { amount: tokenAmount, info: { native_token: { denom: tokenInfo.denom } } },
                  ],
                  slippage_tolerance: slipageTolerance,
                },
              },
              funds: [{ denom: tokenInfo.denom, amount: tokenAmount }],
            },
            sender: address as string,
          });
          await refreshBalances();
        })(),
        {
          loading: {
            title: "Depositing",
            description: `Depositing ${data[singleSideToken]} ${tokenInfo.symbol} to the pool`,
          },
          success: {
            title: "Deposit successful",
            description: `Deposited ${data[singleSideToken]} ${tokenInfo.symbol} to the pool`,
          },
          error: {
            title: "Deposit failed",
            description: `Failed to deposit ${data[singleSideToken]} ${tokenInfo.symbol} to the pool`,
          },
        },
      );
    } else {
      await toast.promise(
        (async () => {
          const token0Amount = convertDenomToMicroDenom(data[token0.symbol], token0.decimals);
          const token1Amount = convertDenomToMicroDenom(data[token1.symbol], token1.decimals);
          await signingClient.execute({
            execute: {
              address: pool.poolAddress,
              message: {
                provide_liquidity: {
                  assets: [
                    { amount: token0Amount, info: { native_token: { denom: token0.denom } } },
                    { amount: token1Amount, info: { native_token: { denom: token1.denom } } },
                  ],
                  slippage_tolerance: slipageTolerance,
                },
              },
              funds: [
                { denom: token0.denom, amount: token0Amount },
                { denom: token1.denom, amount: token1Amount },
              ],
            },
            sender: address as string,
          });
          await refreshBalances();
        })(),
        {
          loading: {
            title: "Depositing",
            description: `Depositing ${data[token0.symbol]} ${token0.symbol} and ${data[token1.symbol]} ${token1.symbol} to the pool`,
          },
          success: {
            title: "Deposit successful",
            description: `Deposited ${data[token0.symbol]} ${token0.symbol} and ${data[token1.symbol]} ${token1.symbol} to the pool`,
          },
          error: {
            title: "Deposit failed",
            description: `Failed to deposit ${data[token0.symbol]} ${token0.symbol} and ${data[token1.symbol]} ${token1.symbol} to the pool`,
          },
        },
      );
    }
  });

  return (
    <BasicModal title="Add Liquidity" classNames={{ wrapper: "max-w-xl", container: "p-0" }}>
      <form className="flex flex-col max-w-xl" onSubmit={onSubmit}>
        <div className="flex flex-col gap-5 px-4 py-5">
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 w-full rounded-xl p-4 flex items-center justify-between">
              <p className="text-white/50 text-sm">
                Selected Pool: <span className="font-bold text-white ">{name}</span>
              </p>
              <div className="flex gap-2 py-1 px-[6px]">
                <Button
                  variant="flat"
                  onPress={() => setSide("double")}
                  className={twMerge("border-2 border-transparent", {
                    " border-tw-orange-500": side.includes("double"),
                  })}
                >
                  Doubled sided
                </Button>
                <Button
                  variant="flat"
                  onPress={() => setSide("single")}
                  className={twMerge("border-2 border-transparent", {
                    " border-tw-orange-500": side.includes("single"),
                  })}
                >
                  One sided
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-white/50 text-sm">Deposit Amount</p>
              <div className="flex gap-4 flex-col">
                <div className="flex flex-col gap-4 bg-white/5 w-full rounded-xl p-4 flex-1">
                  <div className="w-full flex gap-4 items-center justify-between">
                    <motion.button className="flex items-center gap-2 p-2 pr-3 bg-white/5 rounded-full w-fit">
                      <img src={token0.logoURI} alt={token0.symbol} className="w-7 h-7" />
                      <p>{token0.symbol}</p>
                      {side === "single" && <IconChevronDown className="h-4 w-4" />}
                    </motion.button>
                    <input
                      className="text-2xl w-fit bg-transparent text-right"
                      placeholder="0"
                      {...register(token0.symbol, {
                        validate: (value) => {
                          if (value === "") return "Amount is required";
                          if (Number.isNaN(+value)) return "Only enter digits to bond to a vault";
                          if (Number(value) > Number(t0Balance)) return "Insufficient Amount";
                          if (Number(value) <= 0) return "Amount must be greater than 0";
                        },
                      })}
                      value={watch(token0.symbol, "")}
                      onChange={({ target }) => {
                        const regex = /^\d+(\.\d{0,18})?$/;
                        if (target.value === "" || regex.test(target.value)) {
                          setValue(token0.symbol, target.value, { shouldValidate: true });
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2 items-center justify-between text-white/50 text-xs">
                    <div className="flex gap-1 items-center">
                      <IconWallet className="h-4 w-4" />
                      <p>{convertMicroDenomToDenom(t0Balance, token0.decimals)}</p>
                    </div>
                    <p>$0</p>
                  </div>
                </div>
                {side === "double" && (
                  <div className="flex flex-col gap-4 bg-white/5 w-full rounded-xl p-4 flex-1">
                    <div className="w-full flex gap-4 items-center justify-between">
                      <motion.button className="flex items-center gap-2 p-2 pr-3 bg-white/5 rounded-full w-fit">
                        <img src={token1.logoURI} alt={token1.symbol} className="w-7 h-7" />
                        <p>{token1.symbol}</p>
                      </motion.button>
                      <input
                        className="text-2xl w-fit bg-transparent text-right"
                        placeholder="0"
                        {...register(token1.symbol, {
                          validate: (value) => {
                            if (value === "") return "Amount is required";
                            if (Number.isNaN(+value)) return "Only enter digits to bond to a vault";
                            if (Number(value) > Number(t0Balance)) return "Insufficient Amount";
                            if (Number(value) <= 0) return "Amount must be greater than 0";
                          },
                        })}
                        value={watch(token1.symbol, "")}
                        onChange={({ target }) => {
                          const regex = /^\d+(\.\d{0,18})?$/;
                          if (target.value === "" || regex.test(target.value)) {
                            setValue(token1.symbol, target.value, { shouldValidate: true });
                          }
                        }}
                      />
                    </div>
                    <div className="flex gap-2 items-center justify-between text-white/50 text-xs">
                      <div className="flex gap-1 items-center">
                        <IconWallet className="h-4 w-4" />
                        <p>{convertMicroDenomToDenom(t1Balance, token1.decimals)}</p>
                      </div>
                      <p>$0</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Divider dashed />
        <div className="px-4 py-5 flex flex-col gap-4">
          <Button className="w-full text-base" size="md" type="submit" isLoading={isLoading}>
            Deposit & Stake
          </Button>
          <div className="place-self-end gap-3 flex items-center justify-center text-xs text-white/50">
            <div className="flex gap-1 items-center justify-center">
              <IconCoins className="h-4 w-4" />
              <p>Fee</p>
            </div>
            <p className="text-white">-</p>
          </div>
        </div>
      </form>
    </BasicModal>
  );
};

export default ModalDepositLP;
