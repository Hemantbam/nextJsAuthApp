"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeToken } from "../utils/decodeToken";

export default function Dashboard() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("authAppToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = decodeToken(token);

    if (!decoded) {
      router.push("/login");
      return;
    }

    setUserDetails(decoded);
  }, [router]);

  if (!userDetails) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Dashboard</h1>
      <h2>Welcome, {userDetails.email}</h2>
      <p>User ID: {userDetails.id}</p>
    </>
  );
}
