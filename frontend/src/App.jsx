import React, { useRef, useState } from "react";
import "./App.css";
import Home from "./pages/home/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import { FaPlay, FaPause } from "react-icons/fa";

import { SignIn, SignUp, useUser } from "@clerk/clerk-react";

function App() {
  const { authUser } = useAuthContext();
  const { isLoaded, isSignedIn } = useUser();
  const lowResRef = useRef(null);
  const highResRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHighResReady, setIsHighResReady] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      if (!isHighResReady) lowResRef.current?.pause();
      highResRef.current?.pause();
    } else {
      if (!isHighResReady) lowResRef.current?.play();
      highResRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleHighResCanPlayThrough = () => {
    if (!isHighResReady) {
      // Sync the 1080p video time with the 360p video time so the swap is seamless
      if (lowResRef.current && highResRef.current) {
        highResRef.current.currentTime = lowResRef.current.currentTime;
        if (isPlaying) {
          highResRef.current.play();
        }
      }
      setIsHighResReady(true);
      
      // Pause the low res video after the 1-second crossfade finishes to save resources
      setTimeout(() => {
        lowResRef.current?.pause();
      }, 1000); 
    }
  };

  const renderContent = () => {
    if (!isLoaded || (isSignedIn && !authUser)) {
      return (
        <div className="flex items-center justify-center">
          <span className="loading loading-spinner text-primary loading-lg"></span>
        </div>
      );
    }

    return (
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        ></Route>
        <Route
          path="/login/*"
          element={authUser ? <Navigate to={"/"} /> : <SignIn routing="path" path="/login" signUpUrl="/signup" />}
        ></Route>
        <Route
          path="/signup/*"
          element={authUser ? <Navigate to={"/"} /> : <SignUp routing="path" path="/signup" signInUrl="/login" />}
        ></Route>
      </Routes>
    );
  };

  return (
    <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
      {/* 360p Background Video (Loads instantly) */}
      <video
        ref={lowResRef}
        autoPlay
        loop
        muted
        playsInline
        className={`absolute top-0 left-0 w-full h-full object-cover -z-20 transition-opacity duration-1000 ease-in-out ${isHighResReady ? 'opacity-0' : 'opacity-100'}`}
      >
        <source src="/360p.mp4" type="video/mp4" />
      </video>

      {/* 1080p Background Video (Loads silently in background) */}
      <video
        ref={highResRef}
        preload="auto"
        loop
        muted
        playsInline
        onCanPlayThrough={handleHighResCanPlayThrough}
        className={`absolute top-0 left-0 w-full h-full object-cover -z-10 transition-opacity duration-1000 ease-in-out ${isHighResReady ? 'opacity-100' : 'opacity-0'}`}
      >
        <source src="/1080p.mp4" type="video/mp4" />
      </video>

      {/* Main Content */}
      <div className="z-10 w-full h-full flex items-center justify-center">
        {renderContent()}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="absolute bottom-6 right-6 z-50 p-4 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
        title={isPlaying ? "Pause Background" : "Play Background"}
      >
        {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
      </button>

      <Toaster />
    </div>
  );
}

export default App;
