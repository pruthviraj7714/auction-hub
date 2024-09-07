"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, User, Mail, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const transactions = [
  {
    id: 1,
    type: "Purchase",
    amount: 100,
    date: "2023-06-02",
    item: "Bid Coins",
  },
  {
    id: 2,
    type: "Withdrawal",
    amount: 50,
    date: "2023-05-30",
    item: "Auction Winnings",
  },
  { id: 3, type: "Deposit", amount: 200, date: "2023-05-20", item: "Refund" },
];

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("bids");
  const [userInfo, setUserInfo] = useState<any>({});
  const [bids, setBids] = useState<any[]>([]);
  const getUserInfo = async () => {
    try {
      const res = await axios.get("/api/user/info");
      console.log(res.data.user.transcations);
      setUserInfo(res.data.user);
      setBids(res.data.user.bids);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${userInfo.username}`}
                alt={userInfo.username}
              />
              <AvatarFallback>
                {userInfo?.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{userInfo.username}</h1>
              <p className="text-gray-400 mt-1">{userInfo.email}</p>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <Coins className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="font-semibold">
                  {userInfo.bidCoins} Bid Coins
                </span>
              </div>
            </div>
            <Button className="ml-auto bg-purple-600 hover:bg-purple-700">
              Edit Profile
            </Button>
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
                <span>{userInfo.username}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-semibold mr-2">Email:</span>
                <span>{userInfo.email}</span>
              </div>
              <div className="flex items-center">
                <Coins className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-semibold mr-2">Bid Coins:</span>
                <span>{userInfo.bidCoins}</span>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start border-b border-gray-800">
              <TabsTrigger value="bids">Your Bids</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="bids">
              <Card>
                <CardHeader>
                  <CardTitle>Your Bids</CardTitle>
                  <CardDescription>
                    Recent bids you've placed on auctions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bids && bids.map((bid) => (
                      <div
                        key={bid.id}
                        className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold text-purple-600">{bid.auction.title}</h3>
                          <p className="text-sm text-gray-400">
                            Bid Amount: ${bid.amount}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            {bid.timestamp}
                          </p>
                          <span
                            className={`text-sm font-semibold ${
                              bid.isActive === "Winning"
                                ? "text-green-500"
                                : bid.status === "Outbid"
                                ? "text-red-500"
                                : "text-yellow-500"
                            }`}
                          >
                            {bid.isActive}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
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
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center">
                          {transaction.type === "Purchase" ? (
                            <Coins className="h-5 w-5 text-yellow-500 mr-2" />
                          ) : transaction.type === "Withdrawal" ? (
                            <ArrowUpRight className="h-5 w-5 text-red-500 mr-2" />
                          ) : (
                            <ArrowDownLeft className="h-5 w-5 text-green-500 mr-2" />
                          )}
                          <div>
                            <h3 className="font-semibold">
                              {transaction.type}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {transaction.item}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              transaction.type === "Purchase"
                                ? "text-yellow-500"
                                : transaction.type === "Withdrawal"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            ${transaction.amount}
                          </p>
                          <p className="text-sm text-gray-400">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
