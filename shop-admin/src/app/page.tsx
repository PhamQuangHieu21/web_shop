"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

function checkAuth() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("user_info") !== null;
}

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = checkAuth();
    if (isAuthenticated) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin" size={30} />
    </div>
  );
}
