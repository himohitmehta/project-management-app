import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

export default function ProjectDetailPage() {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const createProject = api.board.create.useMutation();
  const handleClick = () => {
    const name = "First board";
    createProject.mutate({ name, projectId: projectId });
  };
  const project = api.board.getLatest.useQuery();
  console.log({ project: project.data });

  return (
    <div>
      ProjectDetailPage:{projectId}
      <Button onClick={() => handleClick()}>Create Board</Button>
      {Array.isArray(project.data) &&
        project.data.map((item) => {
          return (
            <div key={item.id}>
              <Link href={`/${projectId}/${item.id}`}>{item.name}</Link>
            </div>
          );
        })}
    </div>
  );
}
