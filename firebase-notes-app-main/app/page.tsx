"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";

export default function Home() {

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/dashboard";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <h1 className="text-4xl font-bold">
        Notes App
      </h1>

      <button
        onClick={login}
        className="bg-black text-white px-5 py-3 rounded-lg"
      >
        Login with Google
      </button>
    </div>
  );
}