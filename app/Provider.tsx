"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { setLikedUsers } from "@/store/userSlice";

function InitLocalStorageSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = localStorage.getItem("likedUsers");
    if (stored) {
      try {
        dispatch(setLikedUsers(JSON.parse(stored)));
      } catch (e) {
        console.error("Failed to parse likedUsers from localStorage:", e);
      }
    }
  }, [dispatch]);

  return null;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InitLocalStorageSync />
      {children}
    </Provider>
  );
}
