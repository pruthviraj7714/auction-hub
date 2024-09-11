"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, User, Mail, ArrowDownRight, ArrowUpLeft } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("bids");
  const [userInfo, setUserInfo] = useState<any>({});
  const [bids, setBids] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentBidPage, setCurrentBidPage] = useState(0);
  const [currentTransactionPage, setCurrentTransactionPage] = useState(0);
  const ITEMS_PER_PAGE = 4;

  const getUserInfo = async () => {
    try {
      const res = await axios.get("/api/user/info");
      setUserInfo(res.data.user);
      setBids(res.data.user.bids);
      setTransactions(res.data.user.transactions);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (isLoading) {
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
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${userInfo.username}`}
                alt={userInfo.username || "User"}
              />
              <AvatarFallback>
                {userInfo?.username?.slice(0, 2).toUpperCase() || "NA"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">
                {userInfo.username || "N/A"}
              </h1>
              <p className="text-gray-400 mt-1">{userInfo.email || "N/A"}</p>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <Coins className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="font-semibold">
                  {userInfo.bidCoins || 0} Bid Coins
                </span>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Your account details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-semibold mr-2">Username:</span>
                <span>{userInfo.username || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-semibold mr-2">Email:</span>
                <span>{userInfo.email || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <Coins className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-semibold mr-2">Bid Coins:</span>
                <span>{userInfo.bidCoins || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 border-b border-gray-800">
              <TabsTrigger value="bids">Your Bids</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            {/* Bids Section */}
            <TabsContent value="bids">
              <Card>
                <CardHeader>
                  <CardTitle>Your Bids</CardTitle>
                  <CardDescription>
                    Recent bids you&apos;ve placed on auctions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bids && bids.length > 0 ? (
                      bids
                        .slice(
                          currentBidPage * ITEMS_PER_PAGE,
                          currentBidPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
                        )
                        .map((bid) => (
                          <div
                            key={bid.id}
                            className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                          >
                            <div>
                              <h3 className="font-semibold text-purple-600">
                                {bid.auction.title}
                              </h3>
                              <p className="text-sm text-gray-400">
                                Bid Amount: ${bid.amount}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-purple-400">
                                {new Date(bid.timeStamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="font-bold text-center my-10 text-2xl">
                        You haven&apos;t bid on any auctions yet.
                      </div>
                    )}
                  </div>
                </CardContent>

                <Pagination className="my-4">
                  <PaginationContent>
                    <PaginationPrevious
                      className={`${
                        currentBidPage > 0
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      } `}
                      onClick={() =>
                        currentBidPage > 0 &&
                        setCurrentBidPage(currentBidPage - 1)
                      }
                    />
                    {Array(Math.ceil(bids.length / ITEMS_PER_PAGE))
                      .fill(null)
                      .map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            className={`cursor-pointer ${
                              currentBidPage === index
                                ? "bg-black text-white hover:bg-black hover:text-white"
                                : ""
                            }`}
                            onClick={() => setCurrentBidPage(index)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    <PaginationNext
                      className={`${
                        currentBidPage <
                        Math.ceil(bids.length / ITEMS_PER_PAGE) - 1
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      } `}
                      onClick={() =>
                        currentBidPage <
                          Math.ceil(bids.length / ITEMS_PER_PAGE) - 1 &&
                        setCurrentBidPage(currentBidPage + 1)
                      }
                    />
                  </PaginationContent>
                </Pagination>
              </Card>
            </TabsContent>

            {/* Transactions Section */}
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>
                    Your recent financial activities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions && transactions.length > 0 ? (
                      transactions
                        .slice(
                          currentTransactionPage * ITEMS_PER_PAGE,
                          currentTransactionPage * ITEMS_PER_PAGE +
                            ITEMS_PER_PAGE
                        )
                        .map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                          >
                            <div>
                              <h3 className="font-semibold text-purple-600">
                                {transaction.auction.title}
                              </h3>
                              {transaction.status === "inbid" ? (
                                <div className="text-sm font-semibold flex items-center gap-1.5 text-red-400">
                                  <ArrowUpLeft size={25} />
                                  Transaction Amount:{" "}
                                  <span>${transaction.amount}</span>
                                </div>
                              ) : (
                                <div className="text-sm font-semibold flex items-center gap-1.5 text-green-400">
                                  <ArrowDownRight size={25} />
                                  Transaction Amount:{" "}
                                  <span>${transaction.amount}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-purple-400">
                                {new Date(
                                  transaction.createdAt
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="font-bold text-center my-10 text-2xl">
                        You haven&apos;t made any transactions yet.
                      </div>
                    )}
                  </div>
                </CardContent>

                <Pagination className="my-4">
                  <PaginationContent>
                    <PaginationPrevious
                      className={`${
                        currentTransactionPage > 0
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      } `}
                      onClick={() =>
                        currentTransactionPage > 0 &&
                        setCurrentTransactionPage(currentTransactionPage - 1)
                      }
                    />
                    {Array(Math.ceil(transactions.length / ITEMS_PER_PAGE))
                      .fill(null)
                      .map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            className={`cursor-pointer ${
                              currentTransactionPage === index
                                ? "bg-black text-white hover:bg-black hover:text-white"
                                : ""
                            }`}
                            onClick={() => setCurrentTransactionPage(index)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    <PaginationNext
                      className={`${
                        currentTransactionPage <
                        Math.ceil(transactions.length / ITEMS_PER_PAGE) - 1
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      } `}
                      onClick={() =>
                        currentTransactionPage <
                          Math.ceil(transactions.length / ITEMS_PER_PAGE) - 1 &&
                        setCurrentTransactionPage(currentTransactionPage + 1)
                      }
                    />
                  </PaginationContent>
                </Pagination>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
