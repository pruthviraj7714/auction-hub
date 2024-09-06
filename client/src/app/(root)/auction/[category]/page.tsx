"use client";
import AuctionCard from "@/components/AuctionCard";
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
      <h1 className="font-extrabold text-5xl text-purple-500 drop-shadow-lg">
        {params.category}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-white text-6xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {auctions && auctions.length > 0 ? (
            auctions.map((auction) => (
              <div
                key={auction.id}
                className="transform hover:scale-105 transition duration-300"
              >
                <AuctionCard auction={auction} />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center text-white text-xl mt-20">
              <p>No Auctions Found!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
