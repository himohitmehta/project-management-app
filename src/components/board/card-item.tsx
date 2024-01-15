"use client";

import { type Task } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";

// import { useCardModal } from "@/hooks/use-card-modal";

interface CardItemProps {
  data: Task;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
  // const cardModal = useCardModal();

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          // onClick={() => cardModal.onOpen(data.id)}
          className="truncate rounded-md border-2 border-transparent bg-white px-3 py-2 text-sm shadow-sm hover:border-black"
        >
          {data.name}
        </div>
      )}
    </Draggable>
  );
};
