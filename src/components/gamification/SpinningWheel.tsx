"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useGamificationStore, PlayResult, SPIN_SEGMENTS as PRIZES } from "@/store/gamificationStore";
import { getErrorMessage } from "@/lib/api";

export function SpinningWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<PlayResult | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const { spinsAvailable, spin, fetchRewards } = useGamificationStore();

  const handleSpin = async () => {
    if (spinsAvailable <= 0 || isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);

    // The server draws the prize and issues the coupon; the wheel just animates to it
    let played: PlayResult;
    try {
      played = await spin();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't spin the wheel. Please try again."));
      setIsSpinning(false);
      return;
    }
    const prizeIndex = played.segmentIndex;
    
    // Each slice is 360 / PRIZES.length degrees
    const sliceAngle = 360 / PRIZES.length;
    
    // We want the chosen prize to land at the TOP (0 degrees relative to the pointer).
    // The prize's center starts at `prizeIndex * sliceAngle`.
    // The clip-path is perfectly centered, so to land safely inside, we add a random offset
    const randomOffset = Math.floor(Math.random() * (sliceAngle - 10)) - (sliceAngle / 2 - 5);
    const targetAngleOffset = 360 - (prizeIndex * sliceAngle) + randomOffset;
    
    // 5 full spins (1800deg) + the target offset
    const additionalRotation = 1800 + targetAngleOffset;
    
    // Accumulate the rotation so it doesn't snap back to 0 on subsequent spins
    const newAngle = rotationAngle + additionalRotation;
    
    setRotationAngle(newAngle);

    // Wait for the CSS transition (4s) to finish
    setTimeout(() => {
      setResult(played);
      setIsSpinning(false);
      fetchRewards().catch(() => {});
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center w-full min-w-[300px] max-w-[384px] mx-auto text-center">
      <p className="font-label-md text-primary mb-8 tracking-widest uppercase w-full text-center whitespace-nowrap">
        {spinsAvailable > 0 ? "Your daily spin is ready" : "Come back tomorrow for your next spin"}
      </p>
      
      <div className="relative w-64 h-64 mb-10">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-primary z-10 drop-shadow-md" />
        
        {/* Wheel */}
        <div 
          className="w-full h-full rounded-full border-[6px] border-surface-container-high relative overflow-hidden bg-surface soft-shadow"
          style={{ 
            transformOrigin: "center center",
            transform: `rotate(${rotationAngle}deg)`,
            transition: "transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)"
          }}
        >
          {PRIZES.map((prize, i) => {
            const sliceRotation = i * (360 / PRIZES.length);
            return (
              <div 
                key={i}
                className="absolute top-0 left-1/2 origin-bottom flex items-center justify-center font-label-md text-sm text-on-surface"
                style={{
                  height: "50%",
                  width: "100%",
                  marginLeft: "-50%",
                  transform: `rotate(${sliceRotation}deg)`,
                  clipPath: `polygon(50% 100%, 21.1% 0, 78.9% 0)`,
                  backgroundColor: i % 2 === 0 ? "var(--color-surface-container)" : "var(--color-surface-container-high)",
                }}
              >
                <span className="mb-12 text-center w-24 font-bold" style={{ transform: "rotate(90deg)" }}>
                  {prize}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || spinsAvailable <= 0}
        className="w-full py-4 rounded-xl bg-primary text-on-primary font-label-md disabled:opacity-50 hover:bg-primary-container hover:text-on-primary-container active:scale-95 transition-all shadow-lg shadow-primary/20"
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel"}
      </button>

      {result && !isSpinning && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <p className="font-label-md text-primary">
            {result.coupon ? `🎉 You won: ${result.prize}!` : "Oops! Better luck next time."}
          </p>
          {result.coupon && (
            <p className="mt-2 font-caption text-on-surface-variant">
              Your code <span className="font-bold text-on-surface">{result.coupon.code}</span> is saved below.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
