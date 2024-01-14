import { createTRPCRouter } from "~/server/api/trpc";
import { boardRouter } from "./routers/board";
import { listRouter } from "./routers/list";
import { projectRouter } from "./routers/project";
import { taskRouter } from "./routers/task";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  
  project: projectRouter,
  task: taskRouter,
  board: boardRouter,
  list: listRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
