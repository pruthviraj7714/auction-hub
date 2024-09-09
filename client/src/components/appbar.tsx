"use client";
import { DotSquareIcon, Gavel, Hammer, UserCheck } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      <nav className="ml-auto mr-7 flex items-center gap-4 sm:gap-6">
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
            {/* <Button
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
            </Button> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <User
                  className="bg-purple-500 hover:bg-purple-600 rounded-full p-2 cursor-pointer h-10 w-10"
                  size={20}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/me")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/me/auctions")}>
                    <Hammer className="mr-2 h-4 w-4" />
                    <span>My Auctions</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Invite users</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          <span>Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Message</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Github className="mr-2 h-4 w-4" />
                  <span>GitHub</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut({ redirect: false });
                    router.push("/");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </nav>
    </div>
  );
}
