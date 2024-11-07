"use client";

import { useAuth } from "~/app/context/auth";

export default function Navbar() {
  const { auth } = useAuth();

  return (
    <div>
      <h1>Wiki</h1>
      {auth.isLoggedIn ? (
        <div>Logged in as {auth.userId}</div>
      ) : (
        <div>Not logged in</div>
      )}
    </div>
  );
}
