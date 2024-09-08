import { Clock } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function AuctionCard({ auction }: { auction: any }) {
  const now = Date.now();
  const isActive =
    now >= new Date(auction.startingTime).getTime() &&
    now <= new Date(auction.endingTime).getTime();

  return (
    <Link
      href={`/auction/${auction.category}/${auction.id}`}
      key={auction.id}
      className="group relative overflow-hidden rounded-lg bg-gray-900 shadow-lg hover:scale-105 transition-transform duration-300"
    >
      <img
        alt={auction.title}
        className="object-cover w-full h-64 transition-opacity group-hover:opacity-80"
        src={auction?.product?.imageUrl}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-extrabold text-white line-clamp-1">
          {auction.product.title}{" "}
        </h3>
        <h3 className="font-semibold">Starting Price : {auction.startingPrice}</h3>
        <div className="flex justify-between items-center">
          {isActive ? (
            <p className="text-sm text-gray-300 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Ends in {new Date(auction.endingTime).toLocaleString()}
            </p>
          ) : (
            <div className="text-red-500 font-semibold">Auction Ended</div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 bg-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Button className="bg-purple-600 hover:bg-purple-700">Bid Now</Button>
      </div>
    </Link>
  );
}
