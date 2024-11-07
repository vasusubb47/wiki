import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type PublicUserType } from "~/server/model/user";

export default function Navbar() {

  const auth = cookies().get("auth")?.value;
  let user: PublicUserType | undefined;

  if (auth) {
    user = JSON.parse(cookies().get("user")!.value) as PublicUserType;
  }

  console.log(user);

  return (
    <div>
      <div>
        <h1>Wiki</h1>
      </div>
      <div>
        <div><input type="text" /></div>
      </div>
      <div>
        {user ?
          <div>
            <form action={async () => {
                "use server";
                cookies().delete("auth");
                cookies().delete("user");
                redirect("/");
              }}>
              <div>{user.firstName}</div>
              <button type="submit">Logout</button>
            </form>
        </div> 
        : 
        <div><a href="/login">Login</a></div>
        }
      </div>
    </div>
  );
}
