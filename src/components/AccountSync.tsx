"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useGamificationStore } from "@/store/gamificationStore";

// Keeps account-owned data in step with sign-in state
export default function AccountSync() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      useWishlistStore
        .getState()
        .syncWithServer()
        .catch((err) => console.error("Failed to sync wishlist", err));
      useGamificationStore
        .getState()
        .fetchRewards()
        .catch((err) => console.error("Failed to load rewards", err));
    } else if (wasAuthenticated.current) {
      // Signed out: don't leave this account's data on the device for the next person
      useWishlistStore.getState().resetLocal();
      useGamificationStore.getState().reset();
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  return null;
}
