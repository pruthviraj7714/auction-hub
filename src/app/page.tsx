import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Gavel, Lock, Search, DollarSign } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800">
        <Link className="flex items-center justify-center" href="#">
          <Gavel className="h-6 w-6 text-purple-500" />
          <span className="ml-2 text-lg font-bold text-purple-500">AuctionHub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  Bid, Win, Celebrate with AuctionHub
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Experience the thrill of real-time auctions. Discover unique items, place your bids, and win amazing deals from anywhere in the world.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500" placeholder="Enter your email" type="email" />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-500">
                  Sign up to get notified about upcoming auctions. No spam, ever.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-purple-400">Key Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-700 p-4 rounded-lg bg-gray-900">
                <Clock className="h-8 w-8 mb-2 text-purple-500" />
                <h3 className="text-xl font-bold text-purple-400">Real-time Bidding</h3>
                <p className="text-sm text-gray-400 text-center">
                  Experience the thrill of live auctions with instant updates on bids.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-700 p-4 rounded-lg bg-gray-900">
                <Lock className="h-8 w-8 mb-2 text-purple-500" />
                <h3 className="text-xl font-bold text-purple-400">Secure Transactions</h3>
                <p className="text-sm text-gray-400 text-center">
                  Bid and purchase with confidence using our secure payment system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-700 p-4 rounded-lg bg-gray-900">
                <Search className="h-8 w-8 mb-2 text-purple-500" />
                <h3 className="text-xl font-bold text-purple-400">Wide Product Range</h3>
                <p className="text-sm text-gray-400 text-center">
                  Discover a diverse selection of products across various categories.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-purple-400">Popular Auctions</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative group overflow-hidden rounded-lg shadow-lg bg-gray-800">
                  <img
                    alt={`Popular Auction ${i}`}
                    className="object-cover w-full h-60"
                    height="300"
                    src={`/placeholder.svg?height=300&width=400`}
                    style={{
                      aspectRatio: "400/300",
                      objectFit: "cover",
                    }}
                    width="400"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-end p-6 text-white transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <div>
                      <h3 className="text-lg font-bold mb-2">Exclusive Item {i}</h3>
                      <p className="text-sm">Current Bid: $X,XXX</p>
                      <p className="text-sm">Time Left: XX:XX:XX</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-purple-400">Start Bidding Today</h2>
                <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of satisfied users and start your auction journey now. Don't miss out on incredible deals!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1 bg-gray-900 border-gray-700 text-white placeholder-gray-500" placeholder="Enter your email" type="email" />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-500">© 2023 AuctionHub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-gray-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-gray-400" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}