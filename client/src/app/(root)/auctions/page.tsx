"use client";
import AuctionCard from "@/components/AuctionCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);

  const getAllAuctions = async () => {
    try {
      const res = await axios.get("/api/auction/all");
      setAuctions(res.data.auctions);
    } catch (error: any) {
      toast.error(error?.response.data.message);
    }
  };
  useEffect(() => {
    getAllAuctions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="grid grid-cols-3 gap-7">
        {auctions && auctions.length > 0 ? (
          auctions.map((auction: any) => (
            <AuctionCard auction={auction} key={auction.id} />
          ))
        ) : (
          <div>No Auctions Found!</div>
        )}
      </div>
    </div>
  );
}
