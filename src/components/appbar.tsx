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
    <div className="px-4 lg:px-6 h-16 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <Gavel className="h-6 w-6 text-purple-500" />
        <span className="ml-2 text-2xl font-bold text-purple-500">
          AuctionHub
        </span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium hover:text-purple-400 transition-colors"
          href="#featured"
        >
          Featured
        </Link>
        <Link
          className="text-sm font-medium hover:text-purple-400 transition-colors"
          href="#categories"
        >
          Categories
        </Link>
        {session && session?.user ? (
          <div>
            <Button
              onClick={async () => {
                await signOut({ redirect: false });
                router.push("/");
              }}
              variant="destructive"
            >
              Sign out
            </Button>
          </div>
        ) : (
          <div className="ml-4 flex items-center gap-2">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Sign In
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Sign Up
            </Button>
          </div>
        )}
      </nav>
    </div>
  );
}
