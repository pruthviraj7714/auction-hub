import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Gavel, Search, Clock, Tag, Zap, ChevronRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Gavel className="h-6 w-6 text-purple-500" />
          <span className="ml-2 text-2xl font-bold text-purple-500">AuctionHub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#featured">
            Featured
          </Link>
          <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#categories">
            Categories
          </Link>
          <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="/how-it-works">
            How It Works
          </Link>
        </nav>
        <div className="ml-4 flex items-center gap-2">
          <Button variant="ghost" className="text-gray-300 hover:text-white">Sign In</Button>
          <Button className="bg-purple-600 hover:bg-purple-700">Sign Up</Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover Unique Items, Bid & Win
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Join the excitement of live auctions. Find rare collectibles, art, and more.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="flex-1 bg-gray-800 border-gray-700" placeholder="Search auctions..." type="text" />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section id="featured" className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Featured Auctions</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group relative overflow-hidden rounded-lg bg-gray-900 shadow-lg">
                  <img
                    alt={`Featured Auction ${i}`}
                    className="object-cover w-full h-64"
                    height="400"
                    src={`/placeholder.svg?height=400&width=600`}
                    style={{
                      aspectRatio: "3/2",
                      objectFit: "cover",
                    }}
                    width="600"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white mb-2">Exclusive Item {i}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-300 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Ends in 2d 5h
                      </p>
                      <p className="text-sm font-bold text-purple-400">Current Bid: $1,234</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button className="bg-purple-600 hover:bg-purple-700">Bid Now</Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                View All Auctions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        <section id="categories" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Popular Categories</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {["Art", "Electronics", "Collectibles", "Jewelry"].map((category) => (
                <Link key={category} href={`/category/${category.toLowerCase()}`} className="group block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Tag className="h-10 w-10 mb-2 text-purple-500 group-hover:text-purple-400" />
                  <h3 className="text-lg font-semibold mb-2">{category}</h3>
                  <p className="text-sm text-gray-400">Explore {category.toLowerCase()} auctions</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Zap className="h-12 w-12 text-purple-400" />
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Start Bidding?</h2>
              <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of collectors and enthusiasts. Sign up now and get your first bid free!
              </p>
              <Button className="bg-white text-purple-900 hover:bg-gray-100">Create Your Account</Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-500">© 2023 AuctionHub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}