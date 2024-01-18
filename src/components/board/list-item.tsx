"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";

import { cn } from "~/lib/utils";
// import { ListWithCards } from "@/types";

// import { CardForm } from "./card-form";
import { type ListWithTasks } from "~/lib/types";
import { CardItem } from "./card-item";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { api } from "~/utils/api";
// import { ListHeader } from "./list-header";
// import { type List } from "@prisma/client";

interface ListItemProps {
  data: ListWithTasks;
  index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const listId = data.id;
  const { task } = api.useUtils();
  // const tasks = task.getLatest.getData({
  //   listId,
  // });
  const { data: tasks } = api.task.getLatest.useQuery({ listId });
  const { mutate } = api.task.create.useMutation({
    async onMutate({ name, listId }) {
      // await mutate({ name, projectId });
      const list = tasks ?? [];
      task.getLatest.setData({ listId }, [
        ...list,
        {
          name,
          listId,
          assigneeId: "",
          createdAt: new Date(),
          creatorId: "",
          id: "",
          order: 0,
          updatedAt: new Date(),
        },
      ]);
    },
  });
  const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = taskName;
    mutate({
      name,
      listId,

      //   creatorId: sessionData?.user?.id ?? "",
    });
    setTaskName("");
  };
  // const tasks = api.task.getLatest.useQuery();

  const [taskName, setTaskName] = useState("");
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="h-full max-w-[272px] shrink-0 select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md"
          >
            {data.name}
            {/* <ListHeader 
              onAddCard={enableEditing}
              data={data}
            /> */}
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 flex flex-col gap-y-2 px-1 py-0.5",
                    data?.tasks?.length > 0 ? "mt-2" : "mt-0",
                  )}
                >
                  {tasks?.map((card, index) => (
                    <CardItem index={index} key={card.id} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            {/* <CardForm
              listId={data.id}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            /> */}
            <form onSubmit={handleCreateTask} className="flex  gap-2">
              <Input
                // className="border rounded-md "
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
              <Button type="submit">Create Task</Button>
            </form>
          </div>
        </li>
      )}
    </Draggable>
  );
};
