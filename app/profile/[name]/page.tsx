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
      dispatch(swipeRight()); 
      setLiked(true);
    } else {
      const index = likedUsers.findIndex((u) => u.email === user.email);
      if (index !== -1) {
        dispatch(removeLikedUser(index));
      }
      setLiked(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-yellow-500 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center gap-8 max-w-4xl w-full">
        <img
          src={user.photo}
          alt={user.name}
          className="w-64 h-64 object-cover rounded-2xl shadow-lg"
        />

        <div className="flex flex-col text-center md:text-left gap-4">
          <h1 className="text-4xl font-bold text-gray-900">
            {user.name}, <span className="text-pink-600">{user.age}</span>
          </h1>
          <p className="text-gray-600 text-lg">{user.location}</p>
          <p className="text-sm text-gray-700">📧 {user.email}</p>
          <p className="mt-2 text-gray-800 leading-relaxed">{user.bio}</p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleLike}
              className={`px-6 py-2 rounded-xl font-semibold shadow transition ${
                liked
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-pink-500 text-white hover:bg-pink-600"
              }`}
            >
              {liked ? "Liked ✅" : "Like ❤️"}
            </button>

            <button
              onClick={() => router.push("/liked")}
              className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold shadow hover:bg-gray-300 transition"
            >
              View Liked
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold shadow hover:bg-gray-300 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
