import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const boardRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.board.create({
        data: {
          name: input.name,
          projectId: input.projectId,
        },
      });
    }),

  getLatest: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.board.findMany({
        where: {
          projectId: input.projectId,
        },
        // orderBy: { createdAt: "desc" },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
