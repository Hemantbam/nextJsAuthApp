"use client";
import { use, useState } from "react";
import styles from "./login.module.css";
import { login } from "../lib/auth/auth.ts";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await login(email, password);
      console.log(data);
      localStorage.setItem("authAppToken", data.data.accessToken);
      toast.success("Login successful!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 4000);
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    }
  }

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="********"
            />
          </div>

          <button type="submit" className={styles.button}>
            Sign In
          </button>
        </form>

        <p className={styles.extraText}>
          Don’t have an account?{" "}
          <a href="/signup" className={styles.link}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
