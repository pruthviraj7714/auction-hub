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
      console.log(res.data);

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
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover Unique Items, Bid & Win
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Join the excitement of live auctions. Find rare collectibles,
                  art, and more.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="flex-1 bg-gray-800 border-gray-700"
                    placeholder="Search auctions..."
                    type="text"
                  />
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section
          id="featured"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-800"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Featured Auctions
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {auctions && auctions.length > 0 ? (
                auctions.map((auction, index) => (
                  <AuctionCard key={index} auction={auction} />
                ))
              ) : (
                <div>NO auctions found</div>
              )}
            </div>
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              >
                View All Auctions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        <section id="categories" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Popular Categories
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {["Art", "Electronics", "Collectibles", "Jewelry"].map(
                (category) => (
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
                )
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
