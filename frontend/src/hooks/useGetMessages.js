import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { getToken } = useAuth();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
        const res = await fetch(`${baseUrl}/api/messages/${selectedConversation._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages, getToken]);

  return { messages, loading };
};
export default useGetMessages;
