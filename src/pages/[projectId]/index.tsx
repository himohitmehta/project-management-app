import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

export default function ProjectDetailPage() {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  const { data, isLoading, isRefetching } = api.board.getLatest.useQuery(
    {
      projectId,
    },
    {
      enabled: !!projectId,
    },
  );
  console.log({ project: data });

  const { board } = api.useUtils();
  const { mutate } = api.board.create.useMutation({
    async onMutate({ name, projectId }) {
      // await mutate({ name, projectId });
      const list = data ?? [];
      board.getLatest.setData({ projectId }, [
        ...list,
        { name, projectId, id: `${Math.random()}` },
      ]);
    },
  });
  const [boardName, setBoardName] = React.useState("");
  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Rest of the code...
    const name = boardName;
    mutate({ name, projectId: projectId });
    // await refetch();
    setBoardName("");
  };

  if (isLoading || isRefetching) return <div>Loading...</div>;
  return (
    <div className="p-4">
      <div className="py-2">
        <Link href="/">Home</Link>
      </div>
      ProjectDetailPage:{projectId}
      <form onSubmit={handleClick} className="flex  gap-2">
        <Input
          // className="border rounded-md "
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          required
        />
        <Button type="submit">Create Board</Button>
      </form>
      {Array.isArray(data) &&
        data.map((item) => {
          return (
            <div key={item.id}>
              <Link href={`/${projectId}/${item.id}`}>{item.name}</Link>
            </div>
          );
        })}
    </div>
  );
}
