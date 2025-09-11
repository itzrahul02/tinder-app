"use client";

import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
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
import { Nav } from "./Nav";

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
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);

  const dispatch = useDispatch();
  const controls = useAnimation();
  const router = useRouter();
  const [matchPercent, setMatchPercent] = useState<number>(0);

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
  }, [dispatch, fetchUsers, users.length]);

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
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-500">
        <h1 className="text-2xl font-bold text-white">
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
    <>
      <Nav />
      <main className="flex flex-col min-h-screen md:min-h-screen lg:min-h-[93vh] items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-500 gap-6 px-2 sm:px-4">
        
        <div className="flex items-center justify-between w-full max-w-xs  text-white text-xs sm:text-sm">
          <span>
            Profile {currentIndex + 1} of {users.length}
          </span>
          <span>{Math.floor(((currentIndex + 1) / users.length) * 100)}%</span>
        </div>
        
        <Progress
          value={((currentIndex + 1) / users.length) * 100}
          className="w-full max-w-xs  h-2"
        />

        <motion.div
          key={user.email}
          className="relative w-full max-w-xs  rounded-2xl shadow-xl bg-white overflow-hidden cursor-grab select-none"
          drag
          style={{ x, rotate }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 100)
              controls
                .start({ x: 300, y: -100, rotate: 20, opacity: 0 })
                .then(() => handleSwipe("right"));
            else if (info.offset.x < -100)
              controls
                .start({ x: -300, y: -100, rotate: -20, opacity: 0 })
                .then(() => handleSwipe("left"));
            else controls.start({ x: 0, y: 0, rotate: 0, opacity: 1 });
          }}
          animate={controls}
          transition={{ duration: 0.5 }}
        >
          <img
            src={user.photo}
            alt={user.name}
            className="w-full h-52 sm:h-60 object-cover select-none"
            draggable={false}
          />
          <div className="p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl break-words font-bold">
              {user.name}, {user.age}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">📍 {user.location}</p>
            <p className="mt-2 text-xs sm:text-sm text-gray-700 line-clamp-3">{user.bio}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-600">
                Art
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                Photography
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                Pets
              </span>
            </div>

            <Button onClick={() => handleViewProfile(user)} className="mt-4 w-full text-sm sm:text-base">
              View Full Profile
            </Button>
          </div>
          <div className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full">
            {matchPercent}% match
          </div>
        </motion.div>

        <div className="flex gap-3 sm:gap-4">
          <Button
            onClick={() => {
              controls
                .start({ x: -500, y: -100, rotate: -20, opacity: 0 })
                .then(() => handleSwipe("left"));
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-500 hover:bg-red-600 text-xl sm:text-2xl shadow-lg"
          >
            ✖
          </Button>
          <Button
            onClick={() => dispatch(undoSwipe())}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-500 hover:bg-gray-600 text-xl sm:text-2xl shadow-lg"
          >
            ↩
          </Button>
          <Button
            onClick={() => {
              controls
                .start({ x: 500, y: -100, rotate: 20, opacity: 0 })
                .then(() => handleSwipe("right"));
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-500 hover:bg-green-600 text-xl sm:text-2xl shadow-lg"
          >
            ❤
          </Button>
        </div>

      </main>
    </>
  );
}
