"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useGamificationStore, PlayResult } from "@/store/gamificationStore";
import { getErrorMessage } from "@/lib/api";

export function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [play, setPlay] = useState<PlayResult | null>(null);
  const { scratchCards, scratch, fetchRewards } = useGamificationStore();
  const [isActive, setIsActive] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive || isScratched) return; // Prevent redrawing if already scratched

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill the canvas with a silver overlay
    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some "scratch" text pattern
    ctx.fillStyle = "#a0a0a0";
    ctx.font = "20px Arial";
    ctx.fillText("SCRATCH HERE", 70, 70);

    let isDrawing = false;
    let isRevealed = false;

    const getMousePos = (evt: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      
      if ('touches' in evt) {
        clientX = evt.touches[0].clientX;
        clientY = evt.touches[0].clientY;
      } else {
        clientX = (evt as MouseEvent).clientX;
        clientY = (evt as MouseEvent).clientY;
      }
      
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    const scratch = (x: number, y: number) => {
      if (isRevealed) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();

      checkScratchedArea();
    };

    const handleDown = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      const { x, y } = getMousePos(e);
      scratch(x, y);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault(); // Prevent scrolling on touch
      const { x, y } = getMousePos(e);
      scratch(x, y);
    };

    const handleUp = () => {
      isDrawing = false;
    };

    const checkScratchedArea = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentPixels++;
      }

      const totalPixels = pixels.length / 4;
      const percentScratched = (transparentPixels / totalPixels) * 100;

      if (percentScratched > 50 && !isRevealed) {
        isRevealed = true;
        // We only trigger this once because we remove event listeners or `isScratched` stops this block
        // The prize was already awarded by the server when the card was started
        setIsScratched(true);
        fetchRewards().catch(() => {});
        // Clear the entire canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    canvas.addEventListener("mousedown", handleDown);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseup", handleUp);
    canvas.addEventListener("mouseleave", handleUp);
    
    canvas.addEventListener("touchstart", handleDown, { passive: false });
    canvas.addEventListener("touchmove", handleMove, { passive: false });
    canvas.addEventListener("touchend", handleUp);

    return () => {
      canvas.removeEventListener("mousedown", handleDown);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseup", handleUp);
      canvas.removeEventListener("mouseleave", handleUp);
      
      canvas.removeEventListener("touchstart", handleDown);
      canvas.removeEventListener("touchmove", handleMove);
      canvas.removeEventListener("touchend", handleUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isScratched]); // Intentionally omitting fetchRewards to prevent canvas re-initialization

  const handleStart = async () => {
    if (scratchCards <= 0 || isStarting) return;
    setIsStarting(true);
    try {
      // Using a card draws its prize on the server; scratching just reveals it
      setPlay(await scratch());
      setIsScratched(false);
      setIsActive(true);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't start the scratch card. Please try again."));
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-w-[300px] max-w-[384px] mx-auto text-center">
      <p className="font-label-md text-primary mb-8 tracking-widest uppercase w-full text-center whitespace-nowrap">
        {scratchCards} card{scratchCards !== 1 ? 's' : ''} left
      </p>

      {!isActive ? (
        <button
          onClick={handleStart}
          disabled={scratchCards <= 0 || isStarting}
          className="w-full h-[150px] rounded-2xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-headline-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
        >
          {isStarting ? "Preparing card..." : scratchCards > 0 ? "Play Scratch Card" : "No Cards Left"}
        </button>
      ) : (
        <div className="relative w-full max-w-[300px] h-[150px] rounded-2xl overflow-hidden shadow-inner bg-primary/10 flex items-center justify-center border border-primary/30 mx-auto">
          {/* Underlying Prize Text */}
          <div className="text-3xl font-headline-lg text-primary text-center px-4 select-none">
            {play?.prize}
          </div>
          
          {/* Scratchable Canvas */}
          <canvas
            ref={canvasRef}
            width={300}
            height={150}
            className={`absolute inset-0 cursor-crosshair touch-none ${isScratched ? "pointer-events-none" : ""}`}
          />
        </div>
      )}

      {isScratched && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <p className="font-label-md text-primary">
            {play?.coupon
              ? `🎉 You won ${play.prize}! Your code ${play.coupon.code} is saved below.`
              : "Unlucky this time!"}
          </p>
          <button 
            onClick={() => setIsActive(false)}
            className="mt-4 font-label-md text-on-surface-variant hover:text-on-surface transition-colors underline underline-offset-4"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
