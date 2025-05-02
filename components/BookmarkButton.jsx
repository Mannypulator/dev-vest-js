"use client"

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import axios from "axios";

const BookmarkButton = ({ propertyId }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkBookmarkStatus = async () => {
      try {
        const res = await axios.get(
          `/api/bookmarks/check?propertyId=${propertyId}`
        );
        if (!res.data.success) {
          toast.error(res.data.message);
        } else {
          setIsBookmarked(res.data.isBookmarked);
        }
      } catch (error) {
        toast.error("Failed to check bookmark status");
        console.error("Bookmark check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkBookmarkStatus();
  }, [propertyId, userId]);

  const handleClick = async () => {
    if (!userId) {
      toast.error("You need to sign in to bookmark a property");
      return;
    }

    try {
      const res = await axios.post("/api/bookmarks/toggle", { propertyId });
      if (!res.data.success) {
        toast.error(res.data.message);
      } else {
        setIsBookmarked(res.data.isBookmarked);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update bookmark");
      console.error("Bookmark toggle error:", error);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <button
      onClick={handleClick}
      className="bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)] text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center cursor-pointer"
    >
      <Bookmark className="mr-2" />
      {isBookmarked ? "Bookmarked" : "Bookmark Property"}
    </button>
  );
};

export default BookmarkButton;
