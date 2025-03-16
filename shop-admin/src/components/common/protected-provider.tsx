"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userInfo = localStorage.getItem("user_info");

    if (!userInfo) router.replace("/login");
    else setCheckingAuth(false);
  }, []);

  if (!checkingAuth) return <>{children}</>;
}
