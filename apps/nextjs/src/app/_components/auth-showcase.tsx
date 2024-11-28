import { auth, signOut } from "@acme/auth";
import { Button } from "@acme/ui/button";

import ConnectBtn from "./ConnectBtn";

export async function AuthShowcase() {
  const session = await auth();

  if (!session) {
    return (
      <div>
        <ConnectBtn />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span className="flex items-center gap-2">
          Logged in as{" "}
          <span className="rounded-sm bg-zinc-800 px-2 py-1 text-sm font-semibold text-pink-400">
            {session.user.walletAddress}
          </span>
        </span>
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signOut();
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
