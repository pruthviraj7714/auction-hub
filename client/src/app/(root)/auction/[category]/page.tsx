"use client";
import AuctionCard from "@/components/AuctionCard";
import AuctionCard2 from "@/components/AuctionCard2";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CategoryPage({
  params,
}: {
  params: {
    category: string;
  };
}) {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAuctionsInfo = async () => {
    try {
      const res = await axios.get(
        `/api/auction/all?category=${params.category}`
      );
      setAuctions(res.data.auctions);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAuctionsInfo();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <h1 className="font-bold text-2xl text-gray-300 font-sans">
        Here are the auctions for
        <span className="underline underline-offset-2 text-purple-400 font-serif ml-2">
          {params.category}
        </span>
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-purple-700 text-6xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {auctions && auctions.length > 0 ? (
            auctions.map((auction) => (
              <AuctionCard2 key={auction.id} auction={auction} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center text-white text-xl mt-20">
              <p className="animate-pulse">No Auctions Found!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
