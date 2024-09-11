import { ArrowUpRight, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";

export default function AuctionCard2({ auction }: { auction: any }) {
  const now = Date.now();
  const isStartingIn = new Date(auction.startingTime).getTime() >= now;
  const isActive =
    now >= new Date(auction.startingTime).getTime() &&
    now <= new Date(auction.endingTime).getTime();

  const formatTimeLeft = (endTime: string) => {
    const timeLeft = new Date(endTime).getTime() - Date.now();
    if (timeLeft <= 0) return "Ended";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <Link href={`/auction/${auction.category}/${auction.id}`} passHref>
      <Card
        key={auction.id}
        className="transition-transform duration-300 hover:shadow-lg min-h-[390px] cursor-pointer"
      >
        <CardContent className="p-0">
          <img
            src={auction?.product?.imageUrl}
            alt={auction.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{auction.title}</h3>
            <p className="text-sm text-gray-500 mb-2">
              Starting Price:{" "}
              <span className="text-black">${auction.startingPrice}</span>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {isStartingIn ? (
                <div className="font-semibold text-green-500">
                  Not started yet
                </div>
              ) : isActive ? (
                <div className="text-gray-500">
                  Time Left:
                  <span>{formatTimeLeft(auction.endingTime)}</span>
                </div>
              ) : (
                <div>
                  <span className="font-semibold text-red-500">
                    Auction Ended
                  </span>
                </div>
              )}
            </p>
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                className="flex justify-center items-center border border-black/55"
              >
                View Auction
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
