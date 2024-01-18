/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { type Task } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreateListForm from "~/components/board/create-list";
import CreateTaskForm from "~/components/board/create-task";
import { ListItem } from "~/components/board/list-item";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { type ListWithTasks } from "~/lib/types";
import { api } from "~/utils/api";

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  if (removed) {
    result.splice(endIndex, 0, removed);
  }

  return result;
}

export default function BoardDetailPage() {
  const router = useRouter();
  //   const { data: sessionData } = useSession();
  const projectId = router.query.projectId as string;
  const boardId = router.query.boardId as string;
  const utils = api.useUtils();
  const createProject = api.list.create.useMutation({
    onSuccess() {
      void utils.list.invalidate();
    },
  });
  const handleCreateList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = listName;
    createProject.mutate({ name, boardId: boardId });
    setListName("");
  };
  const {
    data: boardData,
    isLoading,
    isRefetching,
    isFetching,
  } = api.list.getLatest.useQuery({
    boardId: boardId,
  });
  console.log({ boardData });

  // const tasks = api.task.getLatest.useQuery();

  // console.log({ tasks: tasks.data });
  const [orderedData, setOrderedData] = useState(boardData);
  useEffect(() => {
    setOrderedData(boardData);
  }, [boardData]);

  const updateListOrder = api.list.updateListOrder.useMutation({
    onSuccess() {
      void utils.list.invalidate();
    },
  });
  const updateCardOrder = api.task.updateCardOrder.useMutation({
    onSuccess() {
      void utils.list.invalidate();
    },
  });
  // const updateTaskOrder =api.task.updateTaskOrder.useMutation()
  const [listName, setListName] = useState("");
  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }
    console.log({ result });

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // User moves a list
    if (type === "list") {
      const items = reorder(
        orderedData ?? [],
        source.index,
        destination.index,
      ).map((item, index) => ({ ...item, order: index }));

      setOrderedData(items);
      updateListOrder.mutate({ items, boardId });
    }

    // User moves a card
    if (type === "card") {
      const newOrderedData = [...(orderedData as ListWithTasks[])];

      // Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId,
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId,
      );

      if (!sourceList || !destList) {
        return;
      }

      // Check if cards exists on the sourceList
      if (!sourceList.tasks) {
        sourceList.tasks = [];
      }

      // Check if cards exists on the destList
      if (!destList.tasks) {
        destList.tasks = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.tasks,
          source.index,
          destination.index,
        );

        reorderedCards.forEach((card: Task, idx: number) => {
          card.order = idx;
        });

        sourceList.tasks = reorderedCards;

        setOrderedData(newOrderedData);
        updateCardOrder.mutate({ items: reorderedCards, boardId });

        // executeUpdateCardOrder({
        //   boardId: boardId,
        //   items: reorderedCards,
        // });
        // User moves the card to another list
      } else {
        // Remove card from the source list
        const [movedCard] = sourceList.tasks.splice(source.index, 1);

        // Assign the new listId to the moved card
        if (movedCard) {
          movedCard.listId = destination.droppableId;
        }

        // Add card to the destination list
        if (movedCard) {
          destList.tasks.splice(destination.index, 0, movedCard);
        }

        sourceList.tasks.forEach((card: Task, idx: number) => {
          card.order = idx;
        });

        // Update the order for each card in the destination list
        destList.tasks.forEach((card: Task, idx: number) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
        updateCardOrder.mutate({ items: destList.tasks, boardId });

        // executeUpdateCardOrder({
        //   boardId: boardId,
        //   items: destList.cards,
        // });
      }
    }
  };
  const { mutate } = api.task.create.useMutation({
    onSuccess: () => {
      void utils.board.getLatest.invalidate();
    },
  });
  const handleCreateTask = (
    e: React.FormEvent<HTMLFormElement>,
    listId: string,
  ) => {
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

  if (isLoading) return <div>Loading...</div>;

  if (Array.isArray(boardData) && boardData.length === 0)
    return (
      <div className="mx-auto max-w-md rounded-md border p-4 text-center">
        <h1 className="my-4 text-2xl font-medium ">No tasks list found</h1>
        <CreateListForm
          handleCreateList={handleCreateList}
          listName={listName}
          setListName={setListName}
        />
      </div>
    );
  if (Array.isArray(boardData) && boardData.length > 0)
    return (
      <div className="mx-auto max-w-7xl">
        {boardData.length < 4 && (
          <CreateListForm
            handleCreateList={handleCreateList}
            listName={listName}
            setListName={setListName}
          />
          // <form onSubmit={handleCreateList} className="flex gap-2">
          //   <Input
          //     // className="border rounded-md "
          //     value={listName}
          //     onChange={(e) => setListName(e.target.value)}
          //     required
          //   />
          //   <Button type="submit">Create List </Button>
          // </form>
        )}
        <div className=" my-4 grid  grid-cols-4 rounded-md border px-2 py-4">
          {" "}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex h-full gap-x-3 "
                >
                  {orderedData
                    ?.sort((a, b) => a.order - b.order)
                    .map((list, index) => {
                      return (
                        <>
                          <ListItem
                            key={list.id}
                            index={index}
                            data={list}
                            // handleCreateTask={(e) =>
                            //   handleCreateTask(e, list.id)
                            // }
                            // setTaskName={setTaskName}
                            // taskName={taskName}
                          />
                        </>
                      );
                    })}
                  {provided.placeholder}
                  <div className="w-1 flex-shrink-0" />
                </ol>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
}
