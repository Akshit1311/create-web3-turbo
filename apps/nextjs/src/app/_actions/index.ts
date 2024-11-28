"use server";

import { signIn } from "@acme/auth";

interface Props {
  address: `0x${string}`;
  signature: `0x${string}`;
}

export const login = async ({ address, signature }: Props) => {
  await signIn("credentials", {
    address,
    signature,
  });
};
