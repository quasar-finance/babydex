"use client";

// src/components/FaucetForm.tsx
import React, { useState, FormEvent, useEffect } from "react";
import Turnstile from "react-cloudflare-turnstile";
import { useAccount } from "wagmi";
import { Button } from "../atoms/Button";
import { twMerge } from "~/utils/twMerge";

const FAUCET_API_URL = "";
const TURNSTILE_KEY = "";

interface FaucetResponse {
  success: boolean;
  message?: string;
  txHash?: string;
}

const FaucetForm: React.FC = () => {
  const { address: connectedAddress } = useAccount();
  const [address, setAddress] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

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
          address,
          captchaToken, 
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
