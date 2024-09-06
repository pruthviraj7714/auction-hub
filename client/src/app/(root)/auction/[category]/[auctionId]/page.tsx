"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  DollarSign,
  User,
  Truck,
  Shield,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AuctionTimer from "@/components/AuctionTimer";

type Bid = {
  id: number;
  bidder: string;
  amount: number;
  timestamp: Date;
};

export default function AuctionItemPage({
  params,
}: {
  params: {
    category: string;
    auctionId: string;
  };
}) {
  const [currentBid, setCurrentBid] = useState(1500);
  const [userBid, setUserBid] = useState("");
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidders, setBidders] = useState(0);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const session = useSession();
  const [auctionInfo, setAuctionInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAuctionInfo = async () => {
    try {
      const res = await axios.get(`/api/auction?auctionId=${params.auctionId}`);
      setAuctionInfo(res.data.auction);
    } catch (error : any) {
      toast.error(error?.response?.data.message)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAuctionInfo();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/auction/${params.auctionId}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "init") {
        setBids(data.bids);
        setCurrentBid(data.currentBid);
        setBidders(data.bids.length);
      } else if (data.type === "newBid") {
        setBids((prevBids) => [data.bid, ...prevBids]);
        setCurrentBid(data.currentBid);
        setBidders((prevBidders) => prevBidders + 1);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws) ws.close();
    };
  }, [params.auctionId]);

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    const bidAmount = parseFloat(userBid);
    if (bidAmount <= currentBid) {
      toast.info("You Should Bid more amount than Current Bid");
      return;
    }
    if (socket) {
      const newBid = { bidder: session?.data?.user.username, bidAmount };
      socket.send(JSON.stringify(newBid));
      setUserBid("");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Auctions
          </Link>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-800">
                <img
                  src={auctionInfo?.product?.imageUrl}
                  alt={auctionInfo.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <AuctionTimer endingTime={auctionInfo.endingTime} />
            </div>
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">
                {auctionInfo.product.title}
              </h1>
              <div className="flex items-center space-x-4 text-2xl font-bold">
                <DollarSign className="h-6 w-6 text-green-500" />
                <span>Current Bid: ${currentBid.toLocaleString()}</span>
              </div>
              <form onSubmit={handleBid}>
                <Input
                  type="number"
                  value={userBid}
                  onChange={(e) => setUserBid(e.target.value)}
                  placeholder={`Enter bid above ${currentBid}`}
                />
                <Button
                  className="bg-purple-500 hover:bg-purple-600 px-4 py-1 mt-2"
                  type="submit"
                >
                  Place Bid
                </Button>
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
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${bid.bidder}`}
                        />
                        <AvatarFallback>
                          {bid?.bidder?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{bid.bidder}</p>
                        <p className="text-xs text-gray-400">
                          {bid.timestamp.toString()}
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
                This vintage Leica M3 camera is a true collector's item.
                Manufactured in 1954, it represents the pinnacle of rangefinder
                camera design. The camera is in excellent condition, with
                minimal signs of use and all original parts intact. It comes
                with its original leather case and strap.
              </p>
              <p className="mt-4">
                The Leica M3 is renowned for its bright viewfinder, precise
                focusing, and quiet operation. This particular model features a
                double-stroke film advance lever and is compatible with a wide
                range of Leica M-mount lenses.
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
                This item will be carefully packaged and shipped via insured
                courier service. Shipping is free within the continental United
                States. International shipping is available at an additional
                cost, calculated at checkout. Please allow 3-5 business days for
                processing and handling before shipment.
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
                    <p className="text-sm text-gray-400 mb-2">
                      Current Bid: $XXX
                    </p>
                    <Button variant="outline" className="w-full">
                      View Auction
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
