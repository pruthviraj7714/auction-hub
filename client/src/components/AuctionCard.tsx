import { Clock } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function AuctionCard({ auction }: { auction: any }) {
  const now = Date.now();
  const isStartingIn = new Date(auction.startingTime).getTime() >= now;
  const isActive =
    now >= new Date(auction.startingTime).getTime() &&
    now <= new Date(auction.endingTime).getTime();

  return (
    <Link
      href={`/auction/${auction.category}/${auction.id}`}
      key={auction.id}
      className="group relative overflow-hidden rounded-lg bg-gray-800 shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
    >
      <img
        alt={auction.title}
        className="object-cover w-full h-64 transition-all duration-300 group-hover:scale-110 group-hover:opacity-80"
        src={auction?.product?.imageUrl}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-xl font-bold text-white line-clamp-1 transition-colors duration-300 group-hover:text-purple-400">
          {auction.product.title}
        </h3>
        <h4 className="text-sm font-semibold text-gray-300">
          Starting Price:{" "}
          <span className="text-white">${auction.startingPrice}</span>
        </h4>

        <div className="flex justify-between items-center mt-2">
          {isStartingIn ? (
            <p className="text-sm text-gray-400 flex items-center">
              <Clock className="h-5 w-5 mr-1 text-purple-500" />
              Starting at {new Date(auction.startingTime).toLocaleString()}
            </p>
          ) : isActive ? (
            <p className="text-sm text-gray-400 flex items-center">
              <Clock className="h-5 w-5 mr-1 text-green-500" />
              Ends at {new Date(auction.endingTime).toLocaleString()}
            </p>
          ) : (
            <p className="text-red-500 font-semibold">Auction Ended</p>
          )}
        </div>
      </div>

      <div className="absolute inset-0 bg-purple-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Button className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
          Bid Now
        </Button>
      </div>
    </Link>
  );
}
