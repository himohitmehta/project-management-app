import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        listId: z.string(),
        // creatorId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const lastList = await ctx.db.task.findFirst({
        where: {
          listId: input.listId,
        },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const newOrder = lastList ? lastList.order + 1 : 0;

      return ctx.db.task.create({
        data: {
          name: input.name,

          listId: input.listId /* add the list value here */,
          creatorId: ctx.session.user.id /* add the creator value here */,
          order: newOrder,
        },
      });
    }),
  updateCardOrder: protectedProcedure
    .input(
      z.object({
        // listId: z.string(),
        boardId: z.string(),
        // items is an array of list
        items: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            order: z.number(),
            listId: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // let lists;
      const transaction = input.items.map((task) =>
        ctx.db.task.update({
          where: {
            id: task.id,
            list: {
              boardId: input.boardId,
            },
            // boardId: input.boardId,
          },
          data: {
            order: task.order,
            listId: task.listId,
          },
        }),
      );

      const lists = await ctx.db.$transaction(transaction);
      return {
        data: lists,
      };
      // ctx.db.list.update({
      //   where: {
      //     id: input.listId,
      //     boardId: input.boardId,
      //     board: {
      //       id: input.boardId,
      //     },
      //   },
      //   data: {
      //     order: input.order,
      //   },
      // });
    }),

  getLatest: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: {
          listId: input.listId,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
