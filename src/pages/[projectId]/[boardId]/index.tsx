import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

export default function BoardDetailPage() {
  const router = useRouter();
//   const { data: sessionData } = useSession();
  const projectId = router.query.projectId as string;
  const boardId = router.query.boardId as string;
  const createProject = api.list.create.useMutation();
  const createTask = api.task.create.useMutation();
  const handleClick = () => {
    const name = "Third list";
    createProject.mutate({ name, boardId: boardId });
  };
  const project = api.list.getLatest.useQuery();
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
  return (
    <div>
      BoardDetailPage
      <div>projectId: {projectId}</div>
      <div>boardId: {boardId}</div>
      <button onClick={() => handleClick()}>Create List</button>
      <div className="grid grid-cols-4">
        {" "}
        {Array.isArray(project.data) &&
          project.data.map((item) => {
            return (
              <div key={item.id} className="col-span-1">
                <div>{item.name}</div>
                <Button onClick={() => handleCreateTask(item.id)}>
                  Create Task
                </Button>
                {
                  Array.isArray(tasks.data) &&
                    tasks.data.map((task) => {
                      if (task.listId === item.id)
                        return (
                          <div key={task.id}>
                            <div>{task.name}</div>
                          </div>
                        );
                    })
                  // <div>{item.description}</div>
                }

                {/* <div>{item.description}</div> */}
              </div>
            );
          })}
      </div>
    </div>
  );
}
