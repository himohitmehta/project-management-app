import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ListItem } from "~/components/board/list-item";
import { type List } from "@prisma/client";
import { useEffect, useState } from "react";
import { ListWithTasks } from "~/lib/types";
function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}
export default function BoardDetailPage() {
  const router = useRouter();
  //   const { data: sessionData } = useSession();
  const projectId = router.query.projectId as string;
  const boardId = router.query.boardId as string;
  const createProject = api.list.create.useMutation();
  const createTask = api.task.create.useMutation();
  const handleClick = () => {
    const name = "Second list";
    createProject.mutate({ name, boardId: boardId });
  };
  const project = api.list.getLatest.useQuery({
    boardId: boardId,
  });
  console.log({ project: project.data });

  const handleCreateTask = (listId: string) => {
    const name = "Fourth task";
    createTask.mutate({
      name,
      listId,
      //   creatorId: sessionData?.user?.id ?? "",
    });
  };
  const tasks = api.task.getLatest.useQuery();

  console.log({ tasks: tasks.data });
  const [orderedData, setOrderedData] = useState(project.data);
  useEffect(() => {
    setOrderedData(project.data);
  }, [project.data]);

  const updateListOrder = api.list.updateListOrder.useMutation();
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
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index }),
      );

      setOrderedData(items);
      updateListOrder.mutate({ items, boardId });
    }

    // User moves a card
    // if (type === "task") {
    //   let newOrderedData = [...orderedData];

    //   // Source and destination list
    //   const sourceList = newOrderedData.find(
    //     (list) => list.id === source.droppableId,
    //   );
    //   const destList = newOrderedData.find(
    //     (list) => list.id === destination.droppableId,
    //   );

    //   if (!sourceList || !destList) {
    //     return;
    //   }

    //   // Check if cards exists on the sourceList
    //   if (!sourceList.cards) {
    //     sourceList.cards = [];
    //   }

    //   // Check if cards exists on the destList
    //   if (!destList.cards) {
    //     destList.cards = [];
    //   }

    //   // Moving the card in the same list
    //   if (source.droppableId === destination.droppableId) {
    //     const reorderedCards = reorder(
    //       sourceList.cards,
    //       source.index,
    //       destination.index,
    //     );

    //     reorderedCards.forEach((card, idx) => {
    //       card.order = idx;
    //     });

    //     sourceList.cards = reorderedCards;

    //     setOrderedData(newOrderedData);
    //     // executeUpdateCardOrder({
    //     //   boardId: boardId,
    //     //   items: reorderedCards,
    //     // });
    //     // User moves the card to another list
    //   } else {
    //     // Remove card from the source list
    //     const [movedCard] = sourceList.cards.splice(source.index, 1);

    //     // Assign the new listId to the moved card
    //     movedCard.listId = destination.droppableId;

    //     // Add card to the destination list
    //     destList.cards.splice(destination.index, 0, movedCard);

    //     sourceList.cards.forEach((card, idx) => {
    //       card.order = idx;
    //     });

    //     // Update the order for each card in the destination list
    //     destList.cards.forEach((card, idx) => {
    //       card.order = idx;
    //     });

    //     setOrderedData(newOrderedData);
    //     // executeUpdateCardOrder({
    //     //   boardId: boardId,
    //     //   items: destList.cards,
    //     // });
    //   }
    // }
  };
  return (
    <div>
      BoardDetailPage
      <div>projectId: {projectId}</div>
      <div>boardId: {boardId}</div>
      <button onClick={() => handleClick()}>Create List</button>
      <div className="grid grid-cols-4 rounded-md border">
        {" "}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="lists" type="list" direction="horizontal">
            {(provided) => (
              <ol
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex h-full gap-x-3"
              >
                {orderedData
                  ?.sort((a, b) => a.order - b.order)
                  .map((list, index) => {
                    return <ListItem key={list.id} index={index} data={list} />;
                  })}
                {provided.placeholder}
                {/* <ListForm /> */}
                <div className="w-1 flex-shrink-0" />
              </ol>
            )}
          </Droppable>
        </DragDropContext>
        {/* {Array.isArray(project.data) &&
          project.data.map((item) => {
            return (
              <div key={item.id} className="col-span-1 rounded-md border p-2">
                <div className="border-b py-2">{item.name}</div>
                <Button
                  variant={"outline"}
                  onClick={() => handleCreateTask(item.id)}
                >
                  Create Task
                </Button>
                {
                  Array.isArray(tasks.data) &&
                    tasks.data.map((task) => {
                      if (task.listId === item.id)
                        return (
                          <div
                            key={task.id}
                            className="my-2 rounded-md border p-2"
                          >
                            <div>{task.name}</div>
                          </div>
                        );
                    })
                  // <div>{item.description}</div>
                }

              </div>
            );
          })} */}
      </div>
    </div>
  );
}
