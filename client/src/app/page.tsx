import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Gavel,
  Lock,
  Search,
  DollarSign,
  ArrowRightSquareIcon,
  ArrowRightCircle,
} from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await getServerSession();

  if (session && session.user) {
    redirect("/home");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800">
        <Link className="flex items-center justify-center" href="#">
          <Gavel className="h-6 w-6 text-purple-500" />
          <span className="ml-2 text-lg font-bold text-purple-500">
            AuctionHub
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:text-purple-400 transition-colors"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:text-purple-400 transition-colors"
            href="#"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:text-purple-400 transition-colors"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:text-purple-400 transition-colors"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  Bid, Win, Celebrate with AuctionHub
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Experience the thrill of real-time auctions. Discover unique
                  items, place your bids, and win amazing deals from anywhere in
                  the world.
                </p>
              </div>
              <div className="w-full max-w-sm mt-10">
                <Link href={"/auth"}>
                  <Button className="bg-purple-600 h-[50px] text-xl w-[230px] hover:bg-purple-700">
                    Get Started <ArrowRightCircle size={25} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-purple-400">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-700 p-4 rounded-lg bg-gray-900">
                <Clock className="h-8 w-8 mb-2 text-purple-500" />
                <h3 className="text-xl font-bold text-purple-400">
                  Real-time Bidding
                </h3>
                <p className="text-sm text-gray-400 text-center">
                  Experience the thrill of live auctions with instant updates on
                  bids.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-700 p-4 rounded-lg bg-gray-900">
                <Lock className="h-8 w-8 mb-2 text-purple-500" />
                <h3 className="text-xl font-bold text-purple-400">
                  Secure Transactions
                </h3>
                <p className="text-sm text-gray-400 text-center">
                  Bid and purchase with confidence using our secure payment
                  system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-700 p-4 rounded-lg bg-gray-900">
                <Search className="h-8 w-8 mb-2 text-purple-500" />
                <h3 className="text-xl font-bold text-purple-400">
                  Wide Product Range
                </h3>
                <p className="text-sm text-gray-400 text-center">
                  Discover a diverse selection of products across various
                  categories.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-purple-400">
                  Start Bidding Today
                </h2>
                <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of satisfied users and start your auction
                  journey now. Don&apos;t miss out on incredible deals!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex items-center space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Link
                    href={"/auth"}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-1 font-serif text-white"
                  >
                    Get Started
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
