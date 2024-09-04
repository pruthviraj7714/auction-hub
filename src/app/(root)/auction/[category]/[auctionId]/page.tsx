"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gavel, Clock, DollarSign, User, Truck, Shield, ArrowLeft, Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const bidderNames = ["Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Henry"]

type Bid = {
  id: number
  bidder: string
  amount: number
  timestamp: Date
}

export default function AuctionItemPage() {
  const [currentBid, setCurrentBid] = useState(1500)
  const [userBid, setUserBid] = useState("")
  const [bids, setBids] = useState<Bid[]>([])
  const [bidders, setBidders] = useState(0)

  useEffect(() => {
    // Simulate incoming bids
    const bidInterval = setInterval(() => {
      const newBid = {
        id: Date.now(),
        bidder: bidderNames[Math.floor(Math.random() * bidderNames.length)],
        amount: currentBid + Math.floor(Math.random() * 100) + 1,
        timestamp: new Date()
      }
      setBids(prevBids => [newBid, ...prevBids.slice(0, 9)])
      setCurrentBid(newBid.amount)
      setBidders(prevBidders => prevBidders + 1)
    }, Math.random() * 5000 + 2000)

    return () => clearInterval(bidInterval)
  }, [currentBid])

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault()
    const bidAmount = parseFloat(userBid)
    if (bidAmount > currentBid) {
      const newBid = {
        id: Date.now(),
        bidder: "You",
        amount: bidAmount,
        timestamp: new Date()
      }
      setBids(prevBids => [newBid, ...prevBids.slice(0, 9)])
      setCurrentBid(bidAmount)
      setUserBid("")
      setBidders(prevBidders => prevBidders + 1)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800">
        <Link href="/" className="flex items-center justify-center">
          <Gavel className="h-6 w-6 text-purple-500" />
          <span className="ml-2 text-2xl font-bold text-purple-500">AuctionHub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
            Browse
          </Link>
          <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
            Help
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Auctions
          </Link>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-800">
                <img
                  src="/placeholder.svg?height=600&width=600"
                  alt="Vintage Camera"
                  className="object-cover w-full h-full"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 bg-gray-900/50 border-gray-700 hover:bg-gray-800"
                >
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Add to favorites</span>
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-md bg-gray-800">
                    <img
                      src={`/placeholder.svg?height=150&width=150&text=Image${i}`}
                      alt={`Vintage Camera Image ${i}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Vintage Leica M3 Camera</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-400">(24 reviews)</span>
              </div>
              <div className="flex items-center space-x-4 text-lg">
                <Clock className="h-5 w-5 text-purple-400" />
                <span>2 days, 5 hours remaining</span>
              </div>
              <div className="flex items-center space-x-4 text-2xl font-bold">
                <DollarSign className="h-6 w-6 text-green-500" />
                <span>Current Bid: ${currentBid.toLocaleString()}</span>
              </div>
              <form onSubmit={handleBid} className="space-y-4">
                <div className="flex space-x-4">
                  <Input
                    type="number"
                    placeholder="Enter your bid"
                    value={userBid}
                    onChange={(e) => setUserBid(e.target.value)}
                    className="flex-1 bg-gray-800 border-gray-700"
                  />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Place Bid
                  </Button>
                </div>
                <p className="text-sm text-gray-400">
                  Enter ${(currentBid + 1).toLocaleString()} or more
                </p>
              </form>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <User className="h-5 w-5" />
                <span>{bidders} bidders</span>
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-purple-400" />
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                  <span>Authenticity guaranteed</span>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Recent Bids</h3>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {bids.map((bid) => (
                    <div key={bid.id} className="flex items-center space-x-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${bid.bidder}`} />
                        <AvatarFallback>{bid.bidder[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{bid.bidder}</p>
                        <p className="text-xs text-gray-400">
                          {bid.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-green-500">
                        ${bid.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Tabs defaultValue="description" className="mt-12">
            <TabsList className="w-full justify-start border-b border-gray-800">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 text-gray-300">
              <p>
                This vintage Leica M3 camera is a true collector's item. Manufactured in 1954, it represents the
                pinnacle of rangefinder camera design. The camera is in excellent condition, with minimal signs of
                use and all original parts intact. It comes with its original leather case and strap.
              </p>
              <p className="mt-4">
                The Leica M3 is renowned for its bright viewfinder, precise focusing, and quiet operation. This
                particular model features a double-stroke film advance lever and is compatible with a wide range of
                Leica M-mount lenses.
              </p>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Manufactured in 1954</li>
                <li>Serial number: 700xxx</li>
                <li>35mm film format</li>
                <li>Rangefinder focusing</li>
                <li>Shutter speeds: 1 sec to 1/1000 sec</li>
                <li>Includes original leather case and strap</li>
                <li>Fully functional, recently serviced</li>
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="mt-4 text-gray-300">
              <p>
                This item will be carefully packaged and shipped via insured courier service. Shipping is free
                within the continental United States. International shipping is available at an additional cost,
                calculated at checkout. Please allow 3-5 business days for processing and handling before shipment.
              </p>
            </TabsContent>
          </Tabs>
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Auctions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={`/placeholder.svg?height=200&width=300&text=Related${i}`}
                    alt={`Related Item ${i}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Vintage Camera {i}</h3>
                    <p className="text-sm text-gray-400 mb-2">Current Bid: $XXX</p>
                    <Button variant="outline" className="w-full">View Auction</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <footer className="mt-auto py-6 px-4 md:px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2023 AuctionHub. All rights reserved.</p>
          <nav className="flex gap-4 mt-4 sm:mt-0">
            <Link className="text-sm text-gray-500 hover:text-gray-400" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm text-gray-500 hover:text-gray-400" href="#">
              Privacy Policy
            </Link>
            <Link className="text-sm text-gray-500 hover:text-gray-400" href="#">
              Contact Us
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}