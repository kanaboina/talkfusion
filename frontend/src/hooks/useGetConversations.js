import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);
	const { getToken } = useAuth();

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const token = await getToken();
				const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
				const res = await fetch(`${baseUrl}/api/users`, {
					headers: { Authorization: `Bearer ${token}` }
				});
				const data = await res.json();
				if (data.error) {
					throw new Error(data.error);
				}
				setConversations(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, [getToken]);

	return { loading, conversations };
};
export default useGetConversations;