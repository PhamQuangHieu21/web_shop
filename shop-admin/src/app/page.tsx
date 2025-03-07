"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = checkAuth(); // Replace with your actual auth logic

    if (isAuthenticated) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, []);

  return <div>Loading...</div>; // Optional loading message
}

// Dummy authentication check function (Replace with real logic)
function checkAuth() {
  if (typeof window === "undefined") return false; // Ensure it's client-side
  return sessionStorage.getItem("token") !== null; // Example: Check for token
}
