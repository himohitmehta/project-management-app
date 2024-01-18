import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import CreateBoard from "~/components/shared/dialogs/create-board";
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

  // const { board } = api.useUtils();
  // const { mutate } = api.board.create.useMutation({
  //   async onMutate({ name, projectId }) {
  //     // await mutate({ name, projectId });
  //     const list = data ?? [];
  //     board.getLatest.setData({ projectId }, [
  //       ...list,
  //       { name, projectId, id: `${Math.random()}` },
  //     ]);
  //   },
  // });
  // const [boardName, setBoardName] = React.useState("");
  // const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // Rest of the code...
  //   const name = boardName;
  //   mutate({ name, projectId: projectId });
  //   // await refetch();
  //   setBoardName("");
  // };

  if (isLoading || isRefetching) return <div>Loading...</div>;
  if (Array.isArray(data) && data.length === 0)
    return (
      <div className="mx-auto my-8 max-w-md rounded-md border p-4">
        <h1 className="py-8 text-center text-xl font-medium">
          No boards found
        </h1>
        <div className="flex justify-center py-4">
          <CreateBoard />
        </div>
      </div>
    );
  if (Array.isArray(data) && data.length > 0)
    return (
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your Boards</h1>
          <CreateBoard />
        </div>

        <div className="my-4 grid grid-cols-3 gap-4">
          {data.map((item) => {
            return (
              <div key={item.id} className="rounded-md border p-4">
                <Link
                  href={`/${projectId}/${item.id}`}
                  className="hover:text-blue-600 hover:underline"
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
}
