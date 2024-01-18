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
import CreateTaskForm from "./create-task";
// import { ListHeader } from "./list-header";
// import { type List } from "@prisma/client";

interface ListItemProps {
  data: ListWithTasks;
  index: number;
  // taskName: string;
  // setTaskName: React.Dispatch<React.SetStateAction<string>>;
  // handleCreateTask: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const listId = data.id;
  const { task, board } = api.useUtils();
  const tasks = data.tasks;
  const { mutate } = api.task.create.useMutation({
    onSuccess: () => {
      void board.getLatest.invalidate();
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
  const [taskName, setTaskName] = useState("");

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="h-full max-w-[272px] shrink-0 select-none p-2"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md"
          >
            <h4 className="p-2 text-lg font-medium"> {data.name}</h4>
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
            <CreateTaskForm
              handleCreateTask={handleCreateTask}
              setTaskName={setTaskName}
              taskName={taskName}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};
