import WebSocket from "ws";
import axios from "axios";
const wss = new WebSocket.Server({ port: 8080 });

const auctionData: {
  [auctionId: string]: { currentBid: number; bids: any[] };
} = {};

const getAuctionData = async (auctionId: string) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/auction?auctionId=${auctionId}`
    );

    if (!auctionData[auctionId]) {
      auctionData[auctionId] = {
        currentBid: res.data.auction.startingPrice || 0,
        bids: [],
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

    ws.send(
      JSON.stringify({
        type: "init",
        bids: auction.bids,
        currentBid: auction.currentBid,
      })
    );

    ws.on("message", (message: any) => {
      try {
        const { bidder, bidAmount } = JSON.parse(message);
        const newBid = {
          id: Date.now(),
          bidder,
          amount: bidAmount,
          timestamp: new Date(),
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
