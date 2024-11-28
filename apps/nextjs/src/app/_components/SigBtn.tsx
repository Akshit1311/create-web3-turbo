import React from "react";
import { useSignMessage } from "wagmi";

import { Button } from "@acme/ui/button";

import { api } from "~/trpc/react";

interface Props {
  walletAddress: `0x${string}`;
  setSignature: React.Dispatch<React.SetStateAction<`0x${string}` | null>>;
}

const SigBtn = ({ walletAddress, setSignature }: Props) => {
  const { mutateAsync } = api.user.generateChallenge.useMutation();
  const { signMessageAsync } = useSignMessage();

  return (
    <Button
      size="lg"
      onClick={async () => {
        const message = await mutateAsync({
          walletAddress,
        });

        const sig = await signMessageAsync({
          account: walletAddress,
          message,
        });

        setSignature(sig);
      }}
    >
      Sign Message
    </Button>
  );
};

export default SigBtn;
