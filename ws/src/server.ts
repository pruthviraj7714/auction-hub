import WebSocket from "ws";
import axios from "axios";

const wss = new WebSocket.Server({ port: 8080 });

interface Bid {
  auctionId: string;
  bidder: string;
  amount: number;
  timestamp: Date;
}

interface Auction {
  currentBid: number;
  bids: Bid[];
  startingTime: string;
  endingTime: string; 
}

const auctionData: { [auctionId: string]: Auction } = {};

const getAuctionData = async (auctionId: string): Promise<Auction> => {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/auction?auctionId=${auctionId}`
    );

    if (!auctionData[auctionId]) {
      auctionData[auctionId] = {
        currentBid: res.data.auction.startingPrice || 0,
        bids: [],
        startingTime: res.data.auction.startingTime,
        endingTime: res.data.auction.endingTime,
      };
    }
    return auctionData[auctionId];
  } catch (error) {
    console.error(
      `Failed to fetch auction data for auctionId ${auctionId}:`,
      error
    );
    throw new Error("Could not fetch auction data");
  }
};

wss.on("connection", async (ws, req) => {
  const url = req.url || "";
  const auctionId = url.split("/").pop();

  if (!auctionId) {
    ws.close();
    return;
  }

  console.log(`New connection for auction: ${auctionId}`);

  try {
    const auction = await getAuctionData(auctionId);
    const startingTime = new Date(auction.startingTime).getTime();
    const endingTime = new Date(auction.endingTime).getTime();

    const checkAuctionStatus = () => {
      const now = Date.now();

      if (now >= startingTime && now < endingTime) {
        ws.send(JSON.stringify({ type: "auctionStart", isAuctionEnded: false }));
      } else if (now >= endingTime && (now - endingTime) <= 1000) {
        ws.send(
          JSON.stringify({
            type: "auctionJustEnded",
            isAuctionJustEnded: true,
          })
        );
      } else if (now >= endingTime) {
        ws.send(JSON.stringify({ type: "auctionEnd", isAuctionEnded: true }));
      }
    };


    checkAuctionStatus();

    ws.send(
      JSON.stringify({
        type: "init",
        bids: auction.bids,
        currentBid: auction.currentBid,
      })
    );


    const intervalId = setInterval(() => {
      checkAuctionStatus();
    }, 1000);


    ws.on("close", () => {
      clearInterval(intervalId);
    });

    ws.on("message", (message: string) => {
      try {
        const { bidder, bidAmount, timestamp, auctionId } = JSON.parse(message);
        const newBid: Bid = {
          auctionId,
          bidder,
          amount: bidAmount,
          timestamp,
        };

        auction.bids.unshift(newBid);
        auction.currentBid = bidAmount;

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "newBid",
                bid: newBid,
                currentBid: auction.currentBid,
              })
            );
          }
        });
      } catch (error) {
        console.error("Failed to process bid:", error);
      }
    });
  } catch (error) {
    console.error(
      `Failed to initialize auction for auctionId ${auctionId}:`,
      error
    );
    ws.send(
      JSON.stringify({ type: "error", message: "Failed to initialize auction" })
    );
    ws.close();
  }
});
