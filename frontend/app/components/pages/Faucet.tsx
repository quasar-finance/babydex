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
import { useMutation } from "@tanstack/react-query";

const FAUCET_API_URL = process.env.NEXT_PUBLIC_FAUCET_API_URL ?? "";
const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_KEY ?? "";

interface FaucetResponse {
  data: {
    send: string;
  };
}

const faucet_assets = ["IBCT1", "IBCT2", "IBCT3", "IBCT4", "IBCT5", "IBCT6"];
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
  const [selectedDenom, setSelectedDenom] = useState(available_denoms[0].value);

  useEffect(() => {
    if (connectedAddress) {
      setAddress(connectedAddress);
    }
  }, [connectedAddress]);

  const { mutateAsync: requestToken, isLoading } = useMutation({
    mutationFn: async () => {
      const id = toast.loading({
        title: "Requesting faucet funds...",
        description: "Please wait while we process your request. This may take 1~2 minutes",
      });

      try {
        const response = await ky
          .post(FAUCET_API_URL, {
            timeout: 120000,
            json: {
              query: `mutation UnoFaucetMutation($chain_id: String!, $denom: String!, $address: String!, $captchaToken: String!) {
              send(chainId: $chain_id, denom: $denom, address: $address, captchaToken: $captchaToken)
            }`,
              variables: {
                chain_id: "bbn-test-5",
                denom: selectedDenom,
                address,
                captchaToken,
              },
            },
          })
          .json<FaucetResponse>();

        if (response.data.send === null) {
          throw new Error("Empty faucet response");
        }

        if (response.data.send.startsWith("ERROR")) {
          throw new Error(response.data.send);
        }

        return response;
      } finally {
        setCaptchaToken("");
        toast.dismiss(id);
      }
    },
    onSuccess: (response) => {
      toast.success({
        title: "Success",
        component: () => (
          <div className="text-sm text-white/50 flex gap-1 items-center">
            <p>Funds sent successfully! </p>
            <Link
              href={`https://www.mintscan.io/babylon-testnet/tx/${response.data.send}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              View Tx
            </Link>
          </div>
        ),
      });
    },
    onError: (e) => {
      toast.error({
        title: "Error",
        description: e instanceof Error ? e.message : "Something went wrong while requesting funds",
      });
    },
  });

  return (
    <div className="flex flex-col gap-10 w-full max-w-xl mx-auto items-center">
      <h1 className="text-xl">Faucet</h1>
      <div className="max-w-sm flex flex-col gap-6 bg-tw-sub-bg p-4 rounded-xl w-full">
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
          size="flexible"
          theme="dark"
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
          isDisabled={!captchaToken}
          fullWidth
          isLoading={isLoading}
          onClick={() => requestToken()}
        >
          {isLoading ? "Requesting..." : "Request Tokens"}
        </Button>
      </div>
    </div>
  );
};

export default FaucetForm;
