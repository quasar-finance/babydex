"use client";

import type React from "react";
import { useEffect, useState } from "react";
import ky from "ky";

import Turnstile from "react-cloudflare-turnstile";
import { useAccount } from "@cosmi/react";

import { Button } from "../atoms/Button";
import Dropdown from "../atoms/Dropdown";
import Input from "../atoms/Input";
import { useToast } from "~/app/hooks";

import { Assets } from "~/config";
import Link from "next/link";

const FAUCET_API_URL = "116.203.127.129";
const TURNSTILE_KEY = "0x4AAAAAAA-eVs5k0b8Q1dl5";

interface FaucetResponse {
  success: boolean;
  message?: string;
  txHash?: string;
}

const faucet_assets = ["ubbn", "IBCT1", "IBCT2", "IBCT3", "IBCT4", "IBCT5", "IBCT6"];

const available_denoms = Object.values(Assets)
  .filter((asset) => faucet_assets.includes(asset.symbol))
  .map((asset) => ({
    value: asset.denom,
    label: (
      <div className="flex items-center gap-2">
        <img src={asset.logoURI} alt={asset.symbol} className="w-5 h-5" />
        <span>{asset.symbol}</span>
      </div>
    ),
  }));

const FaucetForm: React.FC = () => {
  const { address: connectedAddress } = useAccount();
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDenom, setSelectedDenom] = useState("");

  useEffect(() => {
    if (connectedAddress) {
      setAddress(connectedAddress);
    }
  }, [connectedAddress]);

  const handleSubmit = async () => {
    setLoading(true);

    await toast.promise(
      (async () => {
        try {
          const data: FaucetResponse = await ky
            .post(FAUCET_API_URL, {
              json: {
                query: `mutation UnoFaucetMutation($chain_id: String!, $denom: String!, $address: String!, $captchaToken: String!) {
              send(chainId: $chain_id, denom: $denom, address: $address, captchaToken: $captchaToken)
            }`,
                variables: {
                  chain_id: "bbn-testnet-5",
                  denom: selectedDenom,
                  address,
                  captchaToken,
                },
              },
            })
            .json();

          if (!data.success) {
            throw new Error(data.message || "Failed to get faucet funds");
          }

          return data;
        } catch (error) {
          throw new Error("Something went wrong while requesting funds");
        }
      })(),
      {
        loading: {
          title: "Requesting faucet funds...",
          description: "Please wait while we process your request",
        },
        success: {
          title: "Success",
          component: ({ result }) => (
            <div className="text-sm text-white/50 flex gap-1 items-center">
              <p>Funds sent successfully! </p>
              <Link
                href={`${result.txHash}`}
                target="_blank"
                className="underline hover:no-underline"
              >
                View Tx
              </Link>
            </div>
          ),
        },
        error: {
          title: "Error",
          description: "Something went wrong while requesting funds.",
        },
      },
    );

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Faucet</h2>

      <div className="flex flex-col gap-1">
        <p className="text-sm text-white/50">Select Token</p>
        <Dropdown
          defaultValue={available_denoms[0]}
          options={[...available_denoms]}
          onChange={(item) => setSelectedDenom(item.value)}
          classNames={{
            container: "w-full justify-between",
            dropdown: "w-full",
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="address-input" className="text-sm text-white/50">
          Wallet Address
        </label>
        <Input
          label="Wallet Address"
          id="address-input"
          placeholder="bbn1..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          fullWidth
        />
      </div>

      <Turnstile
        turnstileSiteKey={TURNSTILE_KEY}
        callback={(token: string) => {
          setCaptchaToken(token);
        }}
        errorCallback={() => {
          toast.error({
            title: "Captcha Error",
            description: "Error with Turnstile verification",
          });
        }}
        expiredCallback={() => {
          setCaptchaToken("");
          toast.error({
            title: "Captcha Expired",
            description: "Captcha expired, please try again.",
          });
        }}
      />

      <Button
        isDisabled={!captchaToken || loading}
        fullWidth
        isLoading={loading}
        onClick={handleSubmit}
      >
        {loading ? "Requesting..." : "Request Faucet"}
      </Button>
    </div>
  );
};

export default FaucetForm;
