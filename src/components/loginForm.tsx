"use client";

import { useForm } from "react-hook-form";
import { loginSchema, TLogInSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CloseIcon, GoogleIcon } from "@/assets/icons";


export default function LoginForm({ searchParams } : any) {
  const { handleSubmit, register, reset, formState: { errors } } = useForm<TLogInSchema>({
    resolver: zodResolver(loginSchema),
  });

  const emailParams = useSearchParams().get("email") ?? "";
  const [email, setEmail] = useState(emailParams);
  const [error, setError] = useState <string | null> (null);


  const processForm = async (formData: TLogInSchema) => {
    const response = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (response?.error) {
      setError(response.error);

      return;
    }

    reset();
    setError(null);
    setEmail("");
  }

  return (
    <>
      <div className="w-4/5 py-8 bg-neutral-800 rounded border border-neutral-600 flex flex-col items-center justify-center gap-10 max-w-sm">
        <form onSubmit={handleSubmit(processForm)} className="w-4/5 flex flex-col gap-3">
          <div className="default-field-container">
            <label htmlFor="email">Email</label>
            <input className="default-input-field" type="email" {...register("email")} value={email} onChange={(e) => setEmail(e.target.value)}/>
            {errors.email && <p className="text-red-400 text-sm">{`${errors.email.message}`}</p>}
          </div>
          <div className="default-field-container">
            <label htmlFor="password">Password</label>
            <input className="default-input-field" type="password" {...register("password", {required: "Must include a password"})} />
            {errors.password && <p className="text-red-400 text-sm">{`${errors.password.message}`}</p>}
          </div>
          <button type="submit" className="bg-orange-500 text-orange-100 w-full rounded h-10 mt-6 font-semibold">Log In</button>
        </form>
        <div className="w-4/5 h-px relative bg-neutral-600 before:content-['OR'] before:absolute before:-top-2.5 before:bg-neutral-800 before:w-8 before:flex before:justify-center before:left-1/2 before:right-1/2 before:-translate-x-1/2"></div>
        <button onClick={() => signIn("google")} className="bg-white w-4/5 rounded h-10 text-neutral-600 flex items-center justify-center relative font-semibold">
          <GoogleIcon className="absolute left-2 h-3/6" /> 
          Continue with Google
        </button>
      </div>
      {error &&
        <div className="py-1 px-4 bg-neutral-800 rounded border border-neutral-600 fixed mx-auto bottom-5 flex gap-2">
          <p>{error}</p>
          <CloseIcon className="text-neutral-400 w-5 cursor-pointer" onClick={() => setError(null)} />
        </div>
      }
    </>
  )
}
