import LoginForm from "@/components/LoginForm/loginForm";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";


export default async function Login() {
  const session = await getServerSession(authOptions);
  if (!!session?.user) redirect("/");

  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-3">
      <div className="w-4/5 mt-8 max-w-sm">
        <h1 className="text-3xl">Log In</h1>
      </div>
      <LoginForm />
      <div className="mt-4 mb-6 w-4/5 py-8 bg-neutral-800 rounded border border-neutral-600 flex justify-center gap-1 max-w-sm">
        <h2>{(`Don't have an account?`)}</h2>
        <Link className="text-orange-500 font-semibold" href="/register">Create Account</Link>
      </div>
    </main>
  )
}