"use client";

// src/components/FaucetForm.tsx
import React, { useState, FormEvent, useEffect } from "react";
import Turnstile from "react-cloudflare-turnstile";
import { useAccount } from "wagmi";
import { Button } from "../atoms/Button";
import { twMerge } from "~/utils/twMerge";
import Dropdown from "../atoms/Dropdown";

const FAUCET_API_URL = "";
const TURNSTILE_KEY = "";

interface FaucetResponse {
  success: boolean;
  message?: string;
  txHash?: string;
}

const AVAILABLE_DENOMS = [
  { 
    value: "ubbn", 
    label: (
      <div className="flex items-center gap-2">
        <img 
          src="https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/babylontestnet/images/logo.svg" 
          alt="BBN" 
          className="w-5 h-5"
        />
        <span>BBN</span>
      </div>
    )
  },
  { 
    value: "ibc/241F1FFE4117C31D7DFC2A91C026F083FCEB6868C169BA5002FF0B3E17B88EDF", 
    label: (
      <div className="flex items-center gap-2">
        <img 
          src="https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/babylontestnet/images/logo.svg" 
          alt="IBC1" 
          className="w-5 h-5"
        />
        <span>IBC1</span>
      </div>
    )
  },
  { 
    value: "ibc/DC9A0BC30A89A4C767CA2DA3BA1A4B1AB40F6666E720BB4F14213545216C86D8", 
    label: (
      <div className="flex items-center gap-2">
        <img 
          src="https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/babylontestnet/images/logo.svg" 
          alt="IBC2" 
          className="w-5 h-5"
        />
        <span>IBC2</span>
      </div>
    )
  },
  { 
    value: "ibc/53BE513F8FEA2E000E8522CD60383AFA431F0F655EC05A1D56B7428836F3F314", 
    label: (
      <div className="flex items-center gap-2">
        <img 
          src="https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/babylontestnet/images/logo.svg" 
          alt="IBC3" 
          className="w-5 h-5"
        />
        <span>IBC3</span>
      </div>
    )
  },
  { 
    value: "ibc/4BF4FFBF2B84A71627E009ABFD6A870AA6424D6BA9B419D81F446FA80D3AE655", 
    label: (
      <div className="flex items-center gap-2">
        <img 
          src="https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/babylontestnet/images/logo.svg" 
          alt="IBC4" 
          className="w-5 h-5"
        />
        <span>IBC4</span>
      </div>
    )
  },
  { 
    value: "ibc/3AA6631D204C192DDB757935A4C49A0E83EEEE14AC045E8A180CCB4EE08B6196", 
    label: (
      <div className="flex items-center gap-2">
        <img 
          src="https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/babylontestnet/images/logo.svg" 
          alt="IBC5" 
          className="w-5 h-5"
        />
        <span>IBC5</span>
      </div>
    )
  },
  { 
    value: "ibc/2278567FFA6D754BDD8C159CE1770D8AF27649BFB58E5132CF530460591E479D", 
    label: (
      <div className="flex items-center gap-2">
        <img 
          src="https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/babylontestnet/images/logo.svg" 
          alt="IBC6" 
          className="w-5 h-5"
        />
        <span>IBC6</span>
      </div>
    )
  }
] as const;

const FaucetForm: React.FC = () => {
  const { address: connectedAddress } = useAccount();
  const [address, setAddress] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [selectedDenom, setSelectedDenom] = useState("");

  useEffect(() => {
    if (connectedAddress) {
      setAddress(connectedAddress);
    }
  }, [connectedAddress]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResultMessage("");
    setLoading(true);

    try {
      const res = await fetch(FAUCET_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation UnoFaucetMutation($chain_id: String!, $denom: String!, $address: String!, $captchaToken: String!) { 
            send(chainId: $chain_id, denom: $denom, address: $address, captchaToken: $captchaToken) 
          }`,
          variables: {
            chain_id: "bbn-testnet-5",
            denom: selectedDenom,
            address,
            captchaToken,
          }
        }),
      });

      const data: FaucetResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to get faucet funds");
      }

      setResultMessage(
        data.txHash
          ? `Success! TxHash: ${data.txHash}`
          : data.message || "Success!"
      );
    } catch (err) {
      setResultMessage("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Faucet</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label 
            htmlFor="denom-select" 
            className="text-sm text-white/50"
          >
            Select Token
          </label>
          <Dropdown
            defaultValue={AVAILABLE_DENOMS[0]}
            options={AVAILABLE_DENOMS}
            onChange={(item) => setSelectedDenom(item.value)}
            classNames={{
              container: "w-full",
              dropdown: "w-full bg-tw-bg/70 backdrop-blur-lg",
              item: "w-full hover:bg-white/5"
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label 
            htmlFor="address-input" 
            className="text-sm text-white/50"
          >
            Wallet Address
          </label>
          <input
            id="address-input"
            type="text"
            placeholder="bbn1..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className={twMerge(
              "w-full bg-white/5 text-white",
              "border border-white/10 rounded-full",
              "px-3 py-2",
              "text-sm font-mono",
              "placeholder:text-white/50",
              "focus:outline-none focus:border-tw-orange-400/50",
              "transition-colors"
            )}
          />
        </div>

        <Turnstile
          turnstileSiteKey={TURNSTILE_KEY}
          callback={(token: string) => {
            setCaptchaToken(token);
            setResultMessage("");
          }}
          errorCallback={() => {
            setResultMessage("Error with Turnstile verification");
          }}
          expiredCallback={() => {
            setCaptchaToken("");
            setResultMessage("Captcha expired, please try again.");
          }}
        />

        <Button 
          type="submit" 
          isDisabled={!captchaToken || loading}
          className="w-full"
        >
          {loading ? "Requesting..." : "Request Faucet"}
        </Button>
      </form>

      {resultMessage && (
        <p className="mt-4 text-sm text-white/80">
          {resultMessage}
        </p>
      )}
    </div>
  );
};

export default FaucetForm;
