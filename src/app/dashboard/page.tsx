"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeToken } from "../utils/decodeToken";
import "./dashboard.css";

export default function Dashboard() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<any>(null);
  async function handelLogout() {
    try {
      localStorage.removeItem("authAppToken");
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }
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
    return <p className="loadingText">Loading...</p>;
  }

  return (
    <div className="dashboardContainer">
      <h1 className="dashboardTitle">Dashboard</h1>
      <h2 className="dashboardSubtitle">Welcome, {userDetails.email}</h2>
      <p className="dashboardInfo">User ID: {userDetails.id}</p>

      <button onClick={handelLogout}>Logout</button>
    </div>
  );
}
