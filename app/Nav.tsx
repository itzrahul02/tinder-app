"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export const Nav = () => {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between 
      sticky top-0 z-50 border-b lg:p-4 sm:p-2 p-4
      border-black bg-gradient-to-r from-purple-700 to-indigo-600 
      shadow-lg w-full gap-3 sm:gap-0">

      <div
        className="text-lg lg:text-3xl sm:text-2xl md:text-xl font-extrabold 
        bg-gradient-to-r from-purple-950 to-indigo-900 
        bg-clip-text text-transparent 
        drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] 
        "
      >
        TinderSwipe
      </div>

      <div className="flex justify-end w-full sm:w-auto">
        <Button
          className="font-semibold sm:font-bold text-sm sm:text-md bg-black/0 hover:bg-black/10 transition"
          onClick={() => router.push("/liked")}
        >
          Liked Profiles
        </Button>
      </div>
    </nav>
  );
};
