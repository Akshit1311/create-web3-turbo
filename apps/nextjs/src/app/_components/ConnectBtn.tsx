"use client";

import React, { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

import LoginBtn from "./LoginBtn";
import SigBtn from "./SigBtn";

const ConnectBtn = () => {
  const [signature, setSignature] = useState<`0x${string}` | null>(null);

  const { isConnected, address } = useAccount();

  if (!isConnected || !address) return <ConnectKitButton />;

  if (!signature)
    return <SigBtn walletAddress={address} setSignature={setSignature} />;

  return <LoginBtn address={address} signature={signature} />;
};

export default ConnectBtn;
