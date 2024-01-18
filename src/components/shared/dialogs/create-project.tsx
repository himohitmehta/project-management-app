"use client";
import { Loader2 } from "lucide-react";
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

export default function CreateProject() {
  const { project } = api.useUtils();
  const { mutate, isLoading } = api.project.create.useMutation({
    onSuccess() {
      void project.getLatest.invalidate();
      setOpen(false);
    },
  });

  const handleClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = projectName;
    mutate({ name });
    setProjectName("");
  };

  const [projectName, setProjectName] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* <DialogTrigger asChild> */}
      <Button variant="outline" onClick={() => handleOpen()}>
        Create Project
      </Button>
      {/* </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Create a new project to start collaborating with your team.
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
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              placeholder="Project name"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
            Create Project
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
