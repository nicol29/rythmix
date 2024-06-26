import RegistrationForm from "@/components/RegistrationForm/registrationForm";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Register account | Rythmix",
}

export default async function Register() {
  const session = await getServerSession(authOptions);
  if (!!session?.user) redirect("/");

  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-3">
      <div className="w-4/5 mt-8 max-w-sm">
        <h1 className="text-3xl">Register</h1>
      </div>
      <RegistrationForm />
      <div className="mt-4 mb-8 w-4/5 py-8 bg-neutral-800 rounded border border-neutral-600 flex justify-center gap-1 max-w-sm">
        <h2>Already have an account?</h2>
        <Link className="text-orange-500 font-semibold" href="/login">Log in</Link>
      </div>
    </main>
  )
}
