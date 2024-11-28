import { CredentialsSignin } from "@auth/core/errors";
import Credentials from "@auth/core/providers/credentials";
import { verifyMessage } from "viem";
import { z } from "zod";

import { eq } from "@acme/db";
import { db } from "@acme/db/client";
import { ChallengeStore, User } from "@acme/db/schema";
import { constructMessage } from "@acme/web3";

class CustomCredsError extends CredentialsSignin {
  code = "CustomCredsError err";

  constructor(message: string) {
    super();
    this.code = message;
  }
}

const CredsSchema = z.object({
  address: z.custom<`0x${string}`>(),
  signature: z.custom<`0x${string}`>(),
});

const WalletProvider = Credentials({
  name: "Ethereum Wallet Login",
  credentials: {
    address: { label: "Wallet Address", type: "text" },
    signature: { label: "Signature", type: "text" },
  },
  authorize: async (credentials) => {
    const { address, signature } = await CredsSchema.parseAsync(credentials);

    const challengeData = await db.query.ChallengeStore.findFirst({
      where: (challengeStore, { eq }) =>
        eq(challengeStore.walletAddress, address),
    });

    if (!challengeData) {
      throw new CustomCredsError("Challenge not found.");
    }

    const message = constructMessage({
      walletAddress: challengeData.walletAddress,
      issuedAt: challengeData.issuedAt,
      expiresAt: challengeData.expiresAt,
      nonce: challengeData.nonce,
    });

    const recoveredAddress = await verifyMessage({
      address,
      message,
      signature,
    });

    if (!recoveredAddress)
      throw new CustomCredsError("Signature verification failed.");

    await db
      .delete(ChallengeStore)
      .where(eq(ChallengeStore.walletAddress, address));

    let user = await db.query.User.findFirst({
      where: (user, { eq }) => eq(user.walletAddress, address),
    });

    if (!user) {
      const [insertedUsers] = await db
        .insert(User)
        .values({
          walletAddress: address,
        })
        .returning({
          id: User.id,
          walletAddress: User.walletAddress,
        });
      if (!insertedUsers) {
        throw new CustomCredsError("Failed to insert user.");
      }

      user = insertedUsers;
    }

    return user;
  },
});

export default WalletProvider;
