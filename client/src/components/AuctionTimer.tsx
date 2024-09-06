import React, { useState, useEffect } from "react";

const AuctionTimer = ({ endingTime }: { endingTime: any }) => {
  const getTimeLeft = () => new Date(endingTime).getTime() - Date.now();

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const remainingTime = getTimeLeft();
      setTimeLeft(remainingTime > 0 ? remainingTime : 0);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endingTime]);

  const formatTime = (milliseconds: any) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="font-bold text-4xl mt-4 text-purple-400">
      Time Left: {timeLeft > 0 ? formatTime(timeLeft) : "Ended"}
    </div>
  );
};

export default AuctionTimer;
