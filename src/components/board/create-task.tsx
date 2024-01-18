import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function CreateTaskForm({
  taskName,
  setTaskName,
  handleCreateTask,
}: {
  taskName: string;
  setTaskName: React.Dispatch<React.SetStateAction<string>>;
  handleCreateTask: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={handleCreateTask} className="my-2 flex gap-2  px-2">
      <Input
        // className="border rounded-md "
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        required
        placeholder="Add a task"
      />
      <Button type="submit">Add Task</Button>
    </form>
  );
}
