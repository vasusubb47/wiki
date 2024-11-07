
"use server";

// import { useAuth } from "../app/context/auth";

import React from "react";

export default async function Login() {
  // const { _ , setAuthState } = useAuth();

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");
    console.log(email, password);
  }

  return (
    <div>
      <h1>Login</h1>
      <form className="flex flex-col gap-2"
        action={handleSubmit}
      >
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
