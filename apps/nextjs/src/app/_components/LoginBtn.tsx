import React from "react";

import { Button } from "@acme/ui/button";

import { login } from "../_actions";

interface Props {
  address: `0x${string}`;
  signature: `0x${string}`;
}

const LoginBtn = ({ address, signature }: Props) => {
  return (
    <Button size="lg" onClick={() => login({ address, signature })}>
      Login
    </Button>
  );
};

export default LoginBtn;
