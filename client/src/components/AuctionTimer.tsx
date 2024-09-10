import React, { useState, useEffect } from "react";
import { FaClock, FaHourglassStart, FaHourglassEnd } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  const countdownAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      className="flex items-center justify-center mt-8 space-x-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-2xl font-semibold"
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <FaClock className="inline mr-2 text-purple-500" />
        Auction Timer
      </motion.div>

      <motion.div
        className="relative text-xl font-medium text-gray-800 bg-gray-100 rounded-lg shadow-md p-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10 flex items-center space-x-4">
          {timeLeft === 0 ? (
            <div className="text-red-500 flex items-center space-x-2">
              <FaHourglassEnd className="animate-pulse" />
              <span className="animate-pulse">Auction Ended!</span>
            </div>
          ) : Date.now() < new Date(startingTime).getTime() ? (
            <div className="text-yellow-500 flex items-center space-x-2">
              <FaHourglassStart className="animate-bounce" />
              <span>Auction starts in: {`${hours}:${minutes}:${seconds}`}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-green-600">
              <FaHourglassStart className="animate-pulse" />
              <span>Time Left:</span>

              <div className="flex space-x-2">
                <AnimatePresence mode="popLayout">
                  <motion.div key={hours} {...countdownAnimation}>
                    <span>{hours}</span>
                    <span className="text-sm ml-1">h</span>
                  </motion.div>
                  <motion.div key={minutes} {...countdownAnimation}>
                    <span>{minutes}</span>
                    <span className="text-sm ml-1">m</span>
                  </motion.div>
                  <motion.div key={seconds} {...countdownAnimation}>
                    <span>{seconds}</span>
                    <span className="text-sm ml-1">s</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuctionTimer;
