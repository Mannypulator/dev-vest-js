"use client";
import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  bookmarkProperty,
  checkBookmarkStatus,
} from "@/lib/actions/user.actions";
import { toast } from "react-toastify";

const BookmarkButton = ({ property }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      const res = await checkBookmarkStatus(property.id);
      if (!res.success) toast.error(res.message);
      if (res.isBookmarked) setIsBookmarked(res.isBookmarked);
      setLoading(false);
    };

    checkStatus();
  }, [property.id, userId]);

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("You need to sign in to bookmark a property");
      return;
    }

    const res = await bookmarkProperty(property.id);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    setIsBookmarked(!isBookmarked);
    toast.success(res.message);
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <form action={handleSubmit}>
      <button
        type="submit"
        className="bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)] text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
      >
        <Bookmark className="mr-2" />{" "}
        {isBookmarked ? "Bookmarked" : "Bookmark Property"}
      </button>
    </form>
  );
};

export default BookmarkButton;
