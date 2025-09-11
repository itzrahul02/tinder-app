"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { swipeRight, removeLikedUser } from "@/store/userSlice";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const likedUsers = useSelector((state: RootState) => state.user.likedUsers);

  const [liked, setLiked] = useState(false);

  const rawName = params?.name;
  const name =
    typeof rawName === "string"
      ? rawName.split("-").join(" ")
      : Array.isArray(rawName)
      ? rawName.join(" ")
      : "Unknown";

  const user = {
    name,
    age: Number(searchParams.get("age")) || 0,
    location: searchParams.get("location") || "",
    email: searchParams.get("email") || "",
    bio: searchParams.get("bio") || "",
    photo: searchParams.get("photo") || "",
  };

  useEffect(() => {
    const isAlreadyLiked = likedUsers.some((u) => u.email === user.email);
    setLiked(isAlreadyLiked);
  }, [likedUsers, user.email]);

  const handleLike = () => {
    if (!liked) {
      dispatch(swipeRight(user));
    } else {
      const index = likedUsers.findIndex((u) => u.email === user.email);
      if (index !== -1) {
        dispatch(removeLikedUser(index));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-yellow-500 p-4 sm:p-6 md:p-10">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 max-w-4xl w-full">
        <img
          src={user.photo}
          alt={user.name}
          className="w-40 h-40 sm:w-56 sm:h-56 md:w-48 md:h-48 lg:h-64 lg:w-64 object-cover rounded-2xl shadow-lg"
        />

        <div className="flex  flex-col text-center md:text-left gap-3 sm:gap-4 w-full">
          <h1 className="text-2xl sm:text-3xl break-words font-bold text-gray-900">
            {user.name},{" "}
            <span className="text-pink-600">{user.age}</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">{user.location}</p>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 break-words">📧 {user.email}</p>
          <p className="text-sm sm:text-base md:text-sm lg:text-lg text-gray-800 leading-relaxed">
            {user.bio}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
            <button
              onClick={handleLike}
              className={`px-5 sm:px-6 py-2 rounded-xl font-semibold shadow transition ${
                liked
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-pink-500 text-white hover:bg-pink-600"
              }`}
            >
              {liked ? "Liked ✅" : "Like ❤️"}
            </button>

            <button
              onClick={() => router.push("/liked")}
              className="px-5 lg:px-4 md:px-3 sm:px-6 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold shadow hover:bg-gray-300 transition"
            >
              View Liked
            </button>

            <button
              onClick={() => router.back()}
              className="px-5 lg:px-4 md:px-3 sm:px-6 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold shadow hover:bg-gray-300 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
