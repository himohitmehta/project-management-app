import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function CreateListForm({
  listName,
  setListName,
  handleCreateList,
}: {
  listName: string;
  setListName: React.Dispatch<React.SetStateAction<string>>;
  handleCreateList: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={handleCreateList} className="flex gap-2">
      <Input
        // className="border rounded-md "
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        required
        placeholder="Create new list"
      />
      <Button type="submit">Create List </Button>
    </form>
  );
}
