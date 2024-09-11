"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import AuctionCard2 from "@/components/AuctionCard2";

export default function YourAuctionsPage() {
  const [currentAuctions, setCurrentAuctions] = useState<any[]>([]);
  const [pastAuctions, setPastAuctions] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const now = new Date().getTime();
  const getAuctions = async () => {
    try {
      const res = await axios.get("/api/user/auctions");
      setCurrentAuctions(
        res.data.user.auctions?.filter(
          (a: any) => new Date(a.endingTime).getTime() >= now
        )
      );
      setPastAuctions(
        res.data.user.auctions?.filter(
          (a: any) => new Date(a.endingTime).getTime() <= now
        )
      );
      setEarnings(
        res.data.user?.transactions
          ?.filter((tx: any) => tx.status === "outbid")
          .reduce((acc: number, currValue: any) => {
            return acc + currValue.amount;
          }, 0)
      );
    } catch (error: any) {
      toast.error(error?.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAuctions();
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-purple-400 tracking-tight">
            Your Auctions
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-transform transform hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-400">
                  Total Earnings
                </CardTitle>
                <DollarSign className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${earnings}</div>
              </CardContent>
            </Card>

            <Card className="transition-transform transform hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-400">
                  Active Auctions
                </CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentAuctions.length ?? 0}
                </div>
              </CardContent>
            </Card>

            <Card className="transition-transform transform hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-400">
                  Past Auctions
                </CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pastAuctions.length ?? 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="current" className="w-full">
            <TabsList className="w-full grid grid-cols-2 border-b border-gray-800">
              <TabsTrigger
                value="current"
                className="text-purple-400 hover:text-purple-600"
              >
                Current Auctions
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="text-purple-400 hover:text-purple-600"
              >
                Past Auctions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentAuctions && currentAuctions.length > 0 ? (
                  currentAuctions.map((auction) => (
                    <AuctionCard2 auction={auction} key={auction.id} />
                  ))
                ) : (
                  <p className="col-span-3 text-center text-2xl font-bold mt-10">
                    No active auctions
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="past">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastAuctions && pastAuctions.length > 0 ? (
                  pastAuctions.map((auction) => (
                    <AuctionCard2 auction={auction} key={auction.id} />
                  ))
                ) : (
                  <p className="col-span-3 text-center text-2xl font-bold mt-10">
                    No past auctions
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
