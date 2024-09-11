"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  User,
  Truck,
  Shield,
  Clock10,
  Calendar,
  CircleDollarSignIcon,
  Hammer,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
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
import {
  FaChessKing,
  FaExclamationTriangle,
  FaFile,
  FaFileAlt,
  FaFileArchive,
  FaMoneyBillAlt,
  FaMoneyCheckAlt,
  FaProductHunt,
  FaUserAltSlash,
} from "react-icons/fa";

export default function AuctionItemPage({
  params,
}: {
  params: { category: string; auctionId: string };
}) {
  const [currentBid, setCurrentBid] = useState(0);
  const [userBid, setUserBid] = useState("");
  const [bids, setBids] = useState<any[]>([]);
  const [bidders, setBidders] = useState(0);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { data: session, status } = useSession();
  const [auctionInfo, setAuctionInfo] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuctionEnded, setIsAuctionEnded] = useState<boolean>(false);
  const [isStartingIn, setIsStartingIn] = useState(false);

  const getAuctionInfo = async () => {
    try {
      const res = await axios.get(`/api/auction?auctionId=${params.auctionId}`);
      setAuctionInfo(res.data.auction);
      setIsStartingIn(
        new Date(res?.data?.auction?.startingTime).getTime() >=
          new Date().getTime()
      );
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
      } else if (data.type === "auctionStart") {
        setIsStartingIn(false);
        setIsAuctionEnded(data.isAuctionEnded);
      } else if (data.type === "auctionJustEnded") {
        setIsOpen(true);
      } else if (data.type === "auctionEnd") {
        setIsAuctionEnded(data.isAuctionEnded);
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
      toast.error("You don't have enough bidCoins to bid!", {
        position: "top-center",
      });
      return;
    }

    if (bidAmount <= currentBid) {
      toast.info("You should bid more than the current bid!", {
        position: "top-center",
      });
      return;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
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
    } else {
      toast.error("WebSocket connection is not open");
    }
  };

  if (isLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center bg-gray-900 min-h-screen">
        <div className="relative w-20 h-20">
          <div className="absolute border-4 border-t-transparent border-purple-600 rounded-full w-full h-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-800">
                <img
                  src={auctionInfo?.product?.imageUrl}
                  alt={auctionInfo.product?.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="bg-gray-800 p-4 space-y-3 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Product:</h2>
                <div className="flex gap-1.5 items-center">
                  <FaProductHunt />
                  <p>Name : {auctionInfo.product.title}</p>
                </div>
                <div className="text-wrap font-sans">
                  Description : {auctionInfo.product?.description}
                </div>
                <div className="flex gap-1.5 items-center">
                  <CircleDollarSignIcon />
                  <p>Starting Price : ${auctionInfo.startingPrice}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="flex items-center gap-1.5 text-xl font-semibold">
                <Hammer />
                Auction :{" "}
                <span className="font-extrabold text-2xl text-gray-400">
                  {auctionInfo?.title}
                </span>
              </h1>

              <p className="text-gray-300 font-sans">
                {auctionInfo.description || "No description available."}
              </p>

              <div>
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
              {isAuctionEnded ? (
                bids.length > 0 ? (
                  <div className="flex items-center space-x-4 text-2xl font-sans animate-fadeIn transition-transform transform hover:scale-105">
                    <FaChessKing className="h-8 w-8 text-yellow-500 animate-bounce" />
                    <span>
                      The Winner of the auction:{" "}
                      <span className="text-yellow-500 font-bold underline decoration-wavy decoration-yellow-400 hover:text-yellow-600 transition-all duration-300">
                        {bids[0].bidder}
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 text-2xl font-sans text-red-600 animate-pulse">
                    <FaUserAltSlash className="h-8 w-8 text-red-500" />
                    <span className="font-semibold">
                      No one added any bid for this auction
                    </span>
                  </div>
                )
              ) : bids.length > 0 ? (
                <div className="flex items-center space-x-4 text-2xl font-bold animate-fadeIn transition-transform transform hover:scale-105">
                  <DollarSign className="h-8 w-8 text-green-500 animate-pulse" />
                  <span>
                    Current Bid:{" "}
                    <span className="text-green-600">
                      ${currentBid?.toLocaleString()}
                    </span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-4 text-2xl font-bold animate-fadeIn transition-transform transform hover:scale-105">
                  <FaMoneyBillAlt className="h-8 w-8 text-green-500 animate-bounce" />
                  <span>
                    Starting Price:{" "}
                    <span className="text-green-600">
                      ${auctionInfo?.startingPrice}
                    </span>
                  </span>
                </div>
              )}

              <form onSubmit={handleBid}>
                <Input
                  type="number"
                  value={userBid}
                  onChange={(e) => setUserBid(e.target.value)}
                  placeholder={
                    isStartingIn
                      ? "Auction not started yet!"
                      : !isAuctionEnded
                      ? `Enter bid above ${currentBid}`
                      : "Auction Ended"
                  }
                  disabled={isAuctionEnded || isStartingIn}
                />
                <Button
                  disabled={isAuctionEnded || isStartingIn}
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
                  {bids && bids.length > 0 ? (
                    bids.map((bid, index) => (
                      <div key={index} className="flex items-center space-x-4">
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
                    ))
                  ) : isAuctionEnded && bids.length === 0 ? (
                    <div className="text-sm font-extrabold text-red-500">
                      It looks like no one has placed any bids for this auction.
                    </div>
                  ) : (
                    <div className="text-center text-xl font-bold">
                      No bids yet!
                    </div>
                  )}
                </div>
              </div>
              {isOpen && (
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                  {bids.length > 0 ? (
                    <AlertDialogContent className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg animate-slide-in-up">
                      <AlertDialogHeader className="flex flex-col items-center space-y-4">
                        <Avatar className="h-16 w-16 border-2 border-purple-400 p-1 rounded-full animate-spin-slow">
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
                            Congratulations,{" "}
                            <strong className="text-yellow-800 underline">
                              {bids[0].bidder}
                            </strong>
                            ! won the auction for{" "}
                            <strong>{auctionInfo.product?.title}</strong> with a
                            final bid of
                            <span className="text-green-500 font-semibold">
                              {" "}
                              ${bids[0].amount}
                            </span>
                            .
                          </p>
                          <div>
                            {bids.length > 0 &&
                              session?.user.username === bids[0].bidder && (
                                <Link
                                  className="flex gap-2 items-center mt-4 bg-slate-500 p-4 rounded-lg text-white"
                                  href={`/transaction?winner=${bids[0].bidder}&amount=${bids[0].amount}&auctionId=${params.auctionId}&auctionTitle=${auctionInfo.title}`}
                                >
                                  <FaMoneyCheckAlt size={20} />
                                  Make a Payment here
                                </Link>
                              )}
                          </div>
                        </div>
                      </AlertDialogDescription>

                      <AlertDialogFooter className="mt-6">
                        <AlertDialogAction className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg">
                          OK
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  ) : (
                    <AlertDialogContent className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full animate-fadeIn">
                      <div className="flex items-center space-x-4 mb-4">
                        <FaExclamationTriangle className="text-yellow-500 w-8 h-8 animate-pulse" />
                        <AlertDialogTitle className="text-2xl font-bold text-gray-800">
                          No bids placed for this auction
                        </AlertDialogTitle>
                      </div>
                      <AlertDialogDescription className="text-gray-600 mb-6">
                        It looks like no one has placed any bids yet. Stay tuned
                        for updates!
                      </AlertDialogDescription>
                      {bids.length > 0 &&
                      session?.user.username !== bids[0].bidder ? (
                        <div className="flex justify-end space-x-4">
                          <AlertDialogCancel className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                            OK
                          </AlertDialogAction>
                        </div>
                      ) : (
                        <AlertDialogAction className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                          OK
                        </AlertDialogAction>
                      )}
                    </AlertDialogContent>
                  )}
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
