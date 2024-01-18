import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "../ui/button";

export default function AuthComponent() {
  const { data: userData } = useSession();

  return (
    <div>
      {" "}
      <Button
        // className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
        onClick={userData ? () => void signOut() : () => void signIn()}
      >
        {userData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
}
