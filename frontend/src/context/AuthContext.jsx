import { createContext, useContext, useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const syncWithBackend = async () => {
      if (clerkUser) {
        try {
          const token = await getToken();
          const res = await fetch("/api/auth/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              clerkId: clerkUser.id,
              fullName: clerkUser.fullName,
              username: clerkUser.username || clerkUser.firstName,
              profilePic: clerkUser.imageUrl,
            }),
          });
          const data = await res.json();
          setAuthUser(data);
        } catch (error) {
          console.error("Error syncing user with backend:", error);
        }
      } else {
        setAuthUser(null);
      }
    };
    syncWithBackend();
  }, [clerkUser?.id]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
