import User from "../models/user.model.js";
import { getAuth } from "@clerk/express";

const syncUser = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorised" });

    const { clerkId, fullName, username, profilePic } = req.body;

    if (!clerkId || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      // Check if user exists with the same username from the old auth system
      user = await User.findOne({ username });
      if (user) {
        user.clerkId = clerkId;
        user.fullName = fullName || username;
        user.profilePic = profilePic;
        await user.save();
      } else {
        user = new User({
          clerkId,
          fullName: fullName || username,
          username,
          profilePic,
          gender: "other", // default
        });
        await user.save();
      }
    } else {
      user.fullName = fullName || username;
      user.profilePic = profilePic;
      user.username = username;
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in syncUser Controller: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { syncUser };
