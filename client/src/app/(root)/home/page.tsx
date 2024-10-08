"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Tag, ChevronRight } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AuctionCard from "@/components/AuctionCard";

export default function HomePage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const getAuctions = async () => {
    try {
      const res = await axios.get("/api/auction/all");

      setAuctions(res.data.auctions);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getAuctions();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-1">
        <section className="w-full py-10 md:py-20 lg:py-28 xl:py-40 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover Unique Items, Bid & Win
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Join the excitement of live auctions. Find rare collectibles,
                  art, electronics and more.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="featured"
          className="w-full py-12 md:py-20 lg:py-28 bg-gray-800"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Featured Auctions
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {auctions && auctions.length > 0 ? (
                auctions
                  .slice(0, 9)
                  .map((auction, index) => (
                    <AuctionCard key={index} auction={auction} />
                  ))
              ) : (
                <div>No auctions found</div>
              )}
            </div>
            <Link
              href={"/auctions"}
              className="mt-10 flex justify-center items-center text-center"
            >
              <Button
                variant="outline"
                className="border-purple-500 bg-purple-600 text-white hover:bg-purple-500 hover:text-white"
              >
                View All Auctions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
        <section id="categories" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Popular Categories
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {["Art", "Electronics", "Fashion", "Sports"].map((category) => (
                <Link
                  key={category}
                  href={`/auction/${category.toLowerCase()}`}
                  className="group block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Tag className="h-10 w-10 mb-2 text-purple-500 group-hover:text-purple-400" />
                  <h3 className="text-lg font-semibold mb-2">{category}</h3>
                  <p className="text-sm text-gray-400">
                    Explore {category.toLowerCase()} auctions
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
