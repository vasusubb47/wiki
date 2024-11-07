"use client";

import Login from "~/components/login";
import { useAuth } from "./context/auth";
// import { useEffect } from "react";

export default function HomePage() {
  const auth = useAuth();

  return (
    <main>
      {auth.auth.isLoggedIn ? 
        <div>
          <h3>Logged in as {auth.auth.userId}</h3>
          <h1>Hello {auth.auth.username}</h1>
        </div>
       : <div><Login/><h1>Not logged in</h1></div>
       }
    </main>
  );
}
