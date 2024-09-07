"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  User,
  Truck,
  Shield,
  ArrowLeft,
  Clock10,
  Calendar,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AuctionTimer from "@/components/AuctionTimer";
import { checkUserBalance } from "@/lib/helper";
import { useRouter } from "next/navigation";

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
  const [currentBid, setCurrentBid] = useState(0);
  const [userBid, setUserBid] = useState("");
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidders, setBidders] = useState(0);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { data: session, status } = useSession();
  const [auctionInfo, setAuctionInfo] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const now = new Date();
  const isActive =
    now >= new Date(auctionInfo.startingTime) &&
    now <= new Date(auctionInfo.endingTime);

  const getAuctionInfo = async () => {
    try {
      const res = await axios.get(`/api/auction?auctionId=${params.auctionId}`);
      setAuctionInfo(res.data.auction);
    } catch (error: any) {
      toast.error(error?.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAuctionInfo();
  }, [params.auctionId]);

  useEffect(() => {
    if (auctionInfo.endingTime && now == new Date(auctionInfo.endingTime)) {
      setIsOpen(true);
    }
  }, [auctionInfo, now]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/auction/${params.auctionId}`);
    setSocket(ws);

    ws.onopen = () => console.log("Connected to WebSocket");

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

    ws.onerror = (error) => console.error("WebSocket Error:", error);

    ws.onclose = () => console.log("WebSocket connection closed");

    return () => {
      if (ws) ws.close();
    };
  }, [params.auctionId]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    const bidAmount = parseFloat(userBid);
    const userBalance =
      (await checkUserBalance(session?.user.id as string)) ?? 0;

    if (bidAmount > userBalance) {
      toast.error("You don't have enough bidCoins to bid!");
      return;
    }

    if (bidAmount <= currentBid) {
      toast.info("You Should Bid more amount than Current Bid");
      return;
    }

    if (socket) {
      const newBid = {
        bidder: session?.user.username,
        bidAmount,
        auctionId: params.auctionId,
        timestamp: new Date().toISOString(),
      };

      socket.send(JSON.stringify(newBid));

      try {
        await axios.post("/api/publishBid", {
          newBid,
          bidderId: session?.user.id,
        });
        setUserBid("");
      } catch (error) {
        toast.error("Error submitting bid");
      }
    }
  };

  if (isLoading || status === "loading") {
    return <div>Loading...</div>;
  }

  const winningBid = bids.length > 0 ? bids[0].amount : 0;
  const winner = bids.length > 0 ? bids[0].bidder : "No Winner";

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/home"
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
                  alt={auctionInfo.product?.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <AuctionTimer
                startingTime={auctionInfo.startingTime}
                endingTime={auctionInfo.endingTime}
              />
              <div className="p-4 mt-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-md text-white">
                <div className="flex items-center space-x-4">
                  <Calendar className="text-2xl" />
                  <div className="text-lg font-semibold">Auction Time</div>
                </div>
                <div className="mt-2 text-lg">
                  <span className="flex items-center space-x-2">
                    <Clock10 />
                    <span>
                      <span className="font-semibold">Starts:</span>{" "}
                      {new Date(auctionInfo.startingTime).toLocaleString()}
                    </span>
                  </span>
                  <span className="flex items-center space-x-2 mt-1">
                    <Clock10 />
                    <span>
                      <span className="font-semibold">Ends:</span>{" "}
                      {new Date(auctionInfo.endingTime).toLocaleString()}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">
                {auctionInfo.product?.title}
              </h1>
              <div className="flex items-center space-x-4 text-2xl font-bold">
                <DollarSign className="h-6 w-6 text-green-500" />
                <span>Current Bid: ${currentBid?.toLocaleString()}</span>
              </div>
              <form onSubmit={handleBid}>
                <Input
                  type="number"
                  value={userBid}
                  onChange={(e) => setUserBid(e.target.value)}
                  placeholder={
                    isActive ? `Enter bid above ${currentBid}` : "Auction Ended"
                  }
                  disabled={!isActive}
                />
                <Button
                  disabled={!isActive}
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
              {isOpen && (
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                  <AlertDialogContent className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg animate-slide-in-up">
                    <AlertDialogHeader className="flex flex-col items-center space-y-4">
                      <Avatar className="h-16 w-16 border-2 border-purple-400 p-1 rounded-full animate-spin-slow">
                        <AvatarImage
                          src={session?.user?.image || "/default-avatar.png"}
                          alt="User Avatar"
                        />
                        <AvatarFallback className="bg-purple-600 text-white font-bold">
                          {bids[0]?.bidder?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <AlertDialogTitle className="flex items-center space-x-2 text-lg font-bold text-black dark:text-white">
                        <span>Auction Ended</span>
                        <Clock10 className="h-5 w-5 text-purple-500 animate-pulse" />
                      </AlertDialogTitle>
                    </AlertDialogHeader>

                    <AlertDialogDescription className="text-black dark:text-gray-300 mt-4 text-center">
                      <div className="flex flex-col items-center">
                        <div className="mb-3">
                          <Shield className="h-8 w-8 text-yellow-500 animate-bounce" />
                        </div>
                        <p className="text-lg">
                          Congratulations, <strong>{winner}</strong>! won the
                          auction for{" "}
                          <strong>{auctionInfo.product?.title}</strong> with a
                          final bid of
                          <span className="text-green-500 font-semibold">
                            {" "}
                            ${winningBid}
                          </span>
                          .
                        </p>
                      </div>
                    </AlertDialogDescription>

                    <AlertDialogFooter className="mt-6">
                      <AlertDialogAction
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="flex items-center space-x-2">
                          <Truck className="h-5 w-5" />
                          <span>Close</span>
                        </span>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
