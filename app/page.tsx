"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  setUsers,
  swipeRight,
  swipeLeft,
  resetIndex,
  setLikedUsers,
  undoSwipe,
  User,
} from "@/store/userSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

// Proper type for Random User API
interface RandomUserResult {
  name: { first: string; last: string };
  dob: { age: number };
  location: { city: string; country: string };
  picture: { large: string };
  email: string;
}

export default function Home() {
  const { users, currentIndex, likedUsers } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();
  const controls = useAnimation();
  const router = useRouter();
  const [matchPercent, setMatchPercent] = useState<number>(0);

  // Wrap fetchUsers in useCallback to satisfy useEffect dependencies
  const fetchUsers = useCallback(async () => {
    const res = await fetch("https://randomuser.me/api/?results=20");
    const data = await res.json();
    const formattedUsers: User[] = data.results.map((u: RandomUserResult) => ({
      name: `${u.name.first} ${u.name.last}`,
      age: u.dob.age,
      location: `${u.location.city}, ${u.location.country}`,
      photo: u.picture.large,
      email: u.email,
      bio: `Hi, I’m ${u.name.first}. I live in ${u.location.city}. Love meeting new people!`,
    }));
    dispatch(setUsers(formattedUsers));
    dispatch(resetIndex());
  }, [dispatch]);

  useEffect(() => {
    const stored = localStorage.getItem("likedUsers");
    if (stored) dispatch(setLikedUsers(JSON.parse(stored)));

    if (users.length === 0) fetchUsers();
  }, [dispatch, fetchUsers, users.length]); // fixed dependency warning

  useEffect(() => {
    localStorage.setItem("likedUsers", JSON.stringify(likedUsers));
  }, [likedUsers]);

  useEffect(() => {
    if (users.length > 0 && currentIndex < users.length) {
      setMatchPercent(Math.floor(Math.random() * 51) + 50);
    }
  }, [currentIndex, users]);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") dispatch(swipeRight());
    else dispatch(swipeLeft());
    controls.set({ x: 0, opacity: 1 });
  };

  if (users.length === 0 || currentIndex >= users.length) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold">
          {users.length === 0 ? "Loading..." : "No more profiles"}
        </h1>
      </main>
    );
  }

  const user = users[currentIndex];

  const handleViewProfile = (user: User) => {
    const query = new URLSearchParams({
      age: user.age.toString(),
      location: user.location,
      email: user.email,
      bio: user.bio,
      photo: user.photo,
    }).toString();
    router.push(`/profile/${user.name.replace(" ", "-")}?${query}`);
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-r from-pink-600 to-yellow-500 gap-6">
      <motion.div
        key={user.email}
        className="relative w-80 h-[500px] rounded-2xl shadow-lg bg-black overflow-hidden cursor-grab select-none"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 100)
            controls.start({ x: 300, opacity: 0 }).then(() => handleSwipe("right"));
          else if (info.offset.x < -100)
            controls.start({ x: -300, opacity: 0 }).then(() => handleSwipe("left"));
        }}
        animate={controls}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={user.photo}
          alt={user.name}
          className="w-full h-full object-cover select-none"
          draggable={false}
          width={320}
          height={500}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
          <h2 className="text-2xl font-bold">
            {user.name}, {user.age}
          </h2>
          <p className="text-sm">{user.location}</p>

          <div className="mt-2">
            <p className="text-xs">Match: {matchPercent}%</p>
            <Progress value={matchPercent} className="h-2" />
          </div>

          <Button
            onClick={() => handleViewProfile(user)}
            className="mt-4 w-full"
          >
            View Full Profile
          </Button>
        </div>
      </motion.div>

      <div className="flex gap-6">
        <Button
          onClick={() => handleSwipe("left")}
          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-2xl"
        >
          ✖
        </Button>
        <Button
          onClick={() => dispatch(undoSwipe())}
          className="w-14 h-14 rounded-full bg-gray-500 hover:bg-gray-600 text-2xl"
        >
          ↩
        </Button>
        <Button
          onClick={() => handleSwipe("right")}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-2xl"
        >
          ❤
        </Button>
      </div>

      <div className="fixed top-4 right-4 z-50">
        <Button onClick={() => router.push("/liked")}>View Liked Users</Button>
      </div>
    </main>
  );
}
