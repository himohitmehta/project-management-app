import Link from "next/link";
import AuthComponent from "./auth";
import CreateProject from "./dialogs/create-project";
import CreateBoard from "./dialogs/create-board";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const { projectId } = router.query;

  return (
    <div className="flex justify-between px-4 py-4">
      <Link href="/">Home</Link>
      {/* <CreateProject /> */}
      {/* {projectId && <CreateBoard />} */}
      <AuthComponent />
    </div>
  );
}
