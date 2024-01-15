import { type Task, type List } from "@prisma/client";

export type ListWithTasks = List & { tasks: Task[] };

export type TaskWithList = Task & { list: List };
