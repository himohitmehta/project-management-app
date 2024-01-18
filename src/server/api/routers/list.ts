/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const listRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), boardId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      const lastList = await ctx.db.list.findFirst({
        where: {
          boardId: input.boardId,
        },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = lastList ? lastList.order + 1 : 0;

      return ctx.db.list.create({
        data: {
          name: input.name,
          boardId: input.boardId,
          order: Number(newOrder),
        },
      });
    }),
  updateListOrder: protectedProcedure
    .input(
      z.object({
        // listId: z.string(),
        boardId: z.string(),
        // items is an array of list
        items: z.array(
          z.object({
            id: z.string(),
            order: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // let lists;
      const transaction = input.items.map((list) =>
        ctx.db.list.update({
          where: {
            id: list.id,
            board: {
              id: input.boardId,
            },
          },
          data: {
            order: list.order,
          },
        }),
      );

      const lists = await ctx.db.$transaction(transaction);
      return {
        data: lists,
      };
    }),

  getLatest: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.list.findMany({
        include: { tasks: true },
        where: {
          boardId: input.boardId,
        },
        //   orderBy: { createdAt: "desc" },
        //   where: { createdBy: { id: ctx.session.user.id } },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
