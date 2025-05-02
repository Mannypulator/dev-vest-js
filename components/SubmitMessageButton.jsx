"use client"

import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const SubmitMessageButton = () => {
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);

    try {
      const formData = new FormData(event.target.form);
      const data = Object.fromEntries(formData.entries());
      const res = await axios.post("/api/messages", data);
      if (!res.data.success) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        event.target.form.reset();
      }
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Message submission error:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      className="bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)] text-white font-bold py-2 px-4 rounded-full w-full flex items-center justify-center"
      type="button"
      disabled={pending}
    >
      <Send className="mr-2" />
      {pending ? "Sending..." : "Send Message"}
    </button>
  );
};

export default SubmitMessageButton;
