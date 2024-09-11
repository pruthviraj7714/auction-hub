"use client";
import { Gavel, Hammer } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, LogOut, User, UserPlus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  WhatsappIcon,
  WhatsappShareButton,
  InstapaperShareButton,
  PinterestShareButton,
  PinterestIcon,
} from "next-share";

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
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Invite users</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <FacebookShareButton
                          quote="test"
                          url="https://test.com"
                          hashtag="#test"
                        >
                          <div className="flex items-center gap-2">
                            <FacebookIcon className="h-8 w-8 rounded-full" />
                            <span>Facebook</span>
                          </div>
                        </FacebookShareButton>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <WhatsappShareButton
                          title="Share on WhatsApp"
                          url="https://test.com"
                        >
                          <div className="flex items-center gap-2">
                            <WhatsappIcon className="h-8 w-8 rounded-full" />
                            <span>WhatsApp</span>
                          </div>
                        </WhatsappShareButton>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <InstapaperShareButton url="https://test.com">
                          <div className="flex items-center gap-2">
                            <InstagramIcon className="h-8 w-8 rounded-full" />
                            <span>Instagram</span>
                          </div>
                        </InstapaperShareButton>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <TwitterShareButton
                          title="Check this out!"
                          url="https://test.com"
                          hashtags={["test"]}
                        >
                          <div className="flex items-center gap-2">
                            <TwitterIcon className="h-8 w-8 rounded-full" />
                            <span>Twitter</span>
                          </div>
                        </TwitterShareButton>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <PinterestShareButton
                          media="https://test.com/image.jpg"
                          description="Check this out!"
                          url="https://test.com"
                        >
                          <div className="flex items-center gap-2">
                            <PinterestIcon className="h-8 w-8 rounded-full" />
                            <span>Pinterest</span>
                          </div>
                        </PinterestShareButton>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuItem>
                  <Link
                    target="_blank"
                    className="flex mr-4 gap-1.5 items-center"
                    href={"https://github.com/pruthviraj7714/auction-hub"}
                  >
                    <Github size={15} />
                    <span>GitHub</span>
                  </Link>
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="flex gap-2 items-center ml-2 hover:text-red-500 cursor-pointer transition">
                      <LogOut size={15} />
                      Logout
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white text-black">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Sign Out?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to sign out? You will need to log
                        in again to access your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          await signOut({ redirect: false });
                          router.push("/");
                        }}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </nav>
    </div>
  );
}
