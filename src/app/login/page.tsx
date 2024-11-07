import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {authUser} from "pages/api/user/auth";

export default function Login() {

  async function handleSubmit(formData: FormData) {
    "use server";
    const email = formData.get("email") as string ;
    const password = formData.get("password") as string;
    console.log(email, password);
    const res = await authUser(email, password);
    console.log(res);
    if (res.error) {
      console.log(res.error);
    }
    cookies().set("auth", JSON.stringify(res.user?.id));
    cookies().set("user", JSON.stringify(res.user));
    redirect("/");
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
