"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Gavel, DollarSign, User, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function TransactionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const winner = searchParams.get("winner");
  const amount = searchParams.get("amount");
  const auctionId = searchParams.get("auctionId");
  const auctionTitle = searchParams.get("auctionTitle");

  useEffect(() => {
    if (!winner || !amount || !auctionId) {
      toast.error("Missing transaction details");
      router.push("/home");
    }
  }, [winner, amount, auctionId, router]);

  const handleTransaction = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/api/user/transaction?username=${winner}`, {
        auctionId,
        amount: Number(amount),
      });
      toast.success("Transaction successful!");
      router.push("/home");
    } catch (error: any) {
      toast.error("Error processing transaction: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!winner || !amount || !auctionId) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white-100">
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-white bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Complete Your Transaction
            </CardTitle>
            <CardDescription>
              Review and confirm your auction win
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Gavel className="h-5 w-5 text-purple-400" />
              <span className="font-medium">Auction:</span>
              <span>{auctionTitle}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-400" />
              <span className="font-medium">Winner:</span>
              <span>{winner}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="font-medium">Amount Due:</span>
              <span className="text-xl font-bold">${amount}</span>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center space-x-2 text-yellow-500">
              <Clock className="h-5 w-5" />
              <span className="text-sm">
                Please complete your transaction within 24 hours
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              onClick={handleTransaction}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Complete Transaction"}
            </Button>
            <div className="flex items-start space-x-2 text-sm text-gray-400">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p>
                By clicking "Complete Transaction", you agree to the terms of
                service and payment processing for this auction.
              </p>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
