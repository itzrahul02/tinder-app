"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { removeLikedUser, User } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function LikedPage() {
  const likedUsers = useSelector((state: RootState) => state.user.likedUsers);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("likedUsers", JSON.stringify(likedUsers));
  }, [likedUsers]);

  if (likedUsers.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-700 text-xl">
        No liked users yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-pink-700 to-yellow-500">
      <h1 className="text-3xl font-bold mb-6 text-center">Liked Users</h1>
      <div className="flex justify-center items-center gap-6 flex-wrap">
        {likedUsers.map((user: User, index: number) => (
          <Card key={index} className="w-64 shadow-md">
            <Image
              src={user.photo}
              alt={user.name}
              width={256}
              height={160}
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <CardHeader>
              <CardTitle>
                {user.name}, {user.age}
              </CardTitle>
              <p className="text-sm text-gray-600">{user.location}</p>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                variant="default"
                className="flex-1"
                onClick={() =>
                  router.push(
                    `/profile/${user.name.replace(" ", "-")}?age=${user.age}&location=${user.location}&email=${user.email}&bio=${user.bio}&photo=${user.photo}`
                  )
                }
              >
                View Profile
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => dispatch(removeLikedUser(index))}
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
