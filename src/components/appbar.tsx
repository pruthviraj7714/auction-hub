"use client";
import { Button } from "@/components/ui/button";
import { Gavel } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Appbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="px-4 lg:px-6 h-16 bg-gray-900 border-b border-white/10 text-white flex items-center shadow-lg">
      <Link className="flex items-center justify-center" href="/home">
        <Gavel className="h-6 w-6 text-purple-500" />
        <span className="ml-2 text-2xl font-extrabold tracking-wide text-purple-500 hover:text-purple-400 transition-colors">
          AuctionHub
        </span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        {session && session?.user && (
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                router.push("/create-auction");
              }}
              className="bg-purple-500 hover:bg-purple-600 transition-all duration-200 text-sm font-semibold"
            >
              Create Auction
            </Button>
            <Button
              onClick={() => {
                router.push("/me/auctions");
              }}
              className="bg-purple-500 hover:bg-purple-600 transition-all duration-200 text-sm font-semibold"
            >
              Your Auctions
            </Button>
            <Button
              onClick={async () => {
                await signOut({ redirect: false });
                router.push("/");
              }}
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-sm font-semibold"
            >
              Log Out
            </Button>
          </div>
        )}
      </nav>
    </div>
  );
}
