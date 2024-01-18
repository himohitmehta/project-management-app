"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/utils/api";

export default function CreateBoard({
  buttonVariant,
}: {
  buttonVariant?: "outline" | "default";
}) {
  const { board } = api.useUtils();
  const router = useRouter();

  const projectId = router.query.projectId as string;
  const { mutate, isLoading } = api.board.create.useMutation({
    onSuccess() {
      void board.getLatest.invalidate();
      setOpen(false);
    },
  });

  const handleClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (projectId) {
      const name = boardName;
      mutate({ name, projectId });
      setBoardName("");
    }
  };

  const [boardName, setBoardName] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* <DialogTrigger asChild> */}
      <Button variant={buttonVariant ?? "outline"} onClick={() => handleOpen()}>
        Create Board
      </Button>
      {/* </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new Board</DialogTitle>
          <DialogDescription>
            Create a new board to track the the tasks
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleClick} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="col-span-4">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-4"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
            Create Board
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
