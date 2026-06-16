import User from "../models/user.model.js";
import { getAuth } from "@clerk/express";

const protectRoute = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const clerkId = auth?.userId;
    
    if (!clerkId) {
      console.log("Unauthorised: Auth object:", auth, "Headers:", req.headers.authorization);
      return res.status(401).json({ error: "Unauthorised - No Token provided" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: "User not found in DB. Please sync first." });
    
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in Protect Route Controller due to ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;
