import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@acme/db";
import { ChallengeStore, User } from "@acme/db/schema";
import { constructMessage, generateNonce } from "@acme/web3";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  all: publicProcedure.query(({ ctx }) => {
    // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
    return ctx.db.query.User.findMany({
      orderBy: desc(User.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      // return ctx.db
      //   .select()
      //   .from(schema.User)
      //   .where(eq(schema.User.id, input.id));

      return ctx.db.query.User.findFirst({
        where: eq(User.id, input.id),
      });
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(User).where(eq(User.id, input));
  }),

  generateChallenge: publicProcedure
    .input(z.object({ walletAddress: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const now = Date.now();
      const issuedAt = new Date(now);

      const expiresAt = new Date(now + 5 * 60 * 1000);

      const nonce = await generateNonce();

      const existingMessage = await ctx.db.query.ChallengeStore.findFirst({
        where: eq(ChallengeStore.walletAddress, input.walletAddress),
      });

      if (existingMessage) {
        await ctx.db
          .update(ChallengeStore)
          .set({
            issuedAt,
            expiresAt,
            nonce,
          })
          .where(eq(ChallengeStore.walletAddress, input.walletAddress));

        const message = constructMessage({
          walletAddress: input.walletAddress,
          issuedAt,
          expiresAt,
          nonce,
        });

        return message;
      }

      await ctx.db.insert(ChallengeStore).values([
        {
          walletAddress: input.walletAddress,
          issuedAt,
          expiresAt,
          nonce,
        },
      ]);

      const message = constructMessage({
        walletAddress: input.walletAddress,
        issuedAt,
        expiresAt,
        nonce,
      });

      return message;
    }),
} satisfies TRPCRouterRecord;
