import React, { useState, useEffect } from "react";
import { FaClock, FaHourglassStart, FaHourglassEnd } from "react-icons/fa";
import { motion } from "framer-motion";

interface AuctionTimerProps {
  startingTime: Date;
  endingTime: Date;
}

const AuctionTimer: React.FC<AuctionTimerProps> = ({
  startingTime,
  endingTime,
}) => {
  const getTimeLeft = () => {
    const now = Date.now();
    const end = new Date(endingTime).getTime();
    const start = new Date(startingTime).getTime();

    if (now < start) {
      return start - now;
    }

    if (now >= start && now <= end) {
      return end - now;
    }

    return 0;
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const remainingTime = getTimeLeft();
      setTimeLeft(remainingTime > 0 ? remainingTime : 0);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startingTime, endingTime]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center mt-8 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Timer Title */}
      <motion.div
        className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-lg"
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <FaClock className="inline mr-3" />
        Auction Timer
      </motion.div>

      <motion.div
        className="relative font-extrabold text-3xl text-white bg-gradient-to-r from-purple-600 via-pink-500 to-pink-600 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className={`absolute inset-0 rounded-xl  text-white blur-lg opacity-70`}
        ></div>
        <div className="relative z-10">
          {timeLeft === 0 ? (
            <div className="text-red-800 flex items-center">
              <FaHourglassEnd className="mr-3 animate-pulse" /> Auction Ended!
            </div>
          ) : Date.now() < new Date(startingTime).getTime() ? (
            <div className="text-yellow-400 flex items-center">
              <FaHourglassStart className="mr-3 animate-bounce" />
              Auction starts in: {formatTime(timeLeft)}
            </div>
          ) : (
            <div className="text-green-400 flex items-center">
              <FaHourglassStart className="mr-3 animate-pulse" />
              Time Left: {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuctionTimer;
