import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import Header from "~/components/shared/header";
import { Button } from "~/components/ui/button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: userData } = useSession();
  if (!userData) return <AuthShowcase />;

  return (
    <div className="mx-auto max-w-7xl">
      <Header />
      <div>{children}</div>
    </div>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        // className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
}
