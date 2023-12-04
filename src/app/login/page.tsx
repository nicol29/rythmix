import LoginForm from "@/components/loginForm";
import Link from "next/link";


export default function Login() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-3">
      <div className="w-4/5">
        <h1 className="text-2xl">Log In</h1>
      </div>
      <LoginForm />
      <div className="mt-4 w-4/5 py-8 bg-neutral-800 rounded border border-neutral-600 flex justify-center gap-1">
        <h2>{(`Don't have an account?`)}</h2>
        <Link className="text-orange-500 font-semibold" href="/register">Create Account</Link>
      </div>
    </main>
  )
}

