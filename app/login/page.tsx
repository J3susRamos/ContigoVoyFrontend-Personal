"use client";
import Login from "@/components/auth/login";

export default function Logeo() {
  return (
    <div
      className="flex flex-col sm:items-center justify-center h-screen "
      style={{
        backgroundImage: `linear-gradient(to right,rgba(54,22,216, 0.64), rgba(120,99,227, 0.48))`,
      }}
    >
      <Login />
    </div>
  );
}
