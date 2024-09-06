import { Clock } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function AuctionCard({ auction }: { auction: any }) {
  return (
    <Link
      href={`/auction/${auction.category}/${auction.id}`}
      key={auction.id}
      className="group relative overflow-hidden rounded-lg bg-gray-900 shadow-lg"
    >
      <img
        alt={auction.title}
        className="object-cover w-full h-64"
        src={auction?.product?.imageUrl}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold text-white mb-2">
          Exclusive Item {auction.product.startingPrice}
        </h3>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-300 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Ends in {auction.endingTime?.split("T")[1]}
          </p>
          <p className="text-sm font-bold text-purple-400">
            Current Bid: ${auction.currentHighestBid}
          </p>
        </div>
      </div>
      <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button className="bg-purple-600 hover:bg-purple-700">Bid Now</Button>
      </div>
    </Link>
  );
}
