"use client";

import { useForm } from "react-hook-form";
import { loginSchema, TLogInSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CloseIcon } from "@/assets/icons";


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

    console.log(response);

    response?.error ? setError(response.error) : setError(null);
    // reset();
    // setEmail("");
  }

  return (
    <>
      <form onSubmit={handleSubmit(processForm)} className="w-4/5 py-8 bg-neutral-800 rounded border border-neutral-600 flex flex-col items-center gap-3 max-w-sm">
        <div className="default-field-container w-4/5">
          <label htmlFor="email">Email</label>
          <input className="default-input-field" type="email" {...register("email")} value={email} onChange={(e) => setEmail(e.target.value)}/>
          {errors.email && <p className="text-red-400 text-sm">{`${errors.email.message}`}</p>}
        </div>
        <div className="default-field-container w-4/5">
          <label htmlFor="password">Password</label>
          <input className="default-input-field" type="password" {...register("password", {required: "Must include a password"})} />
          {errors.password && <p className="text-red-400 text-sm">{`${errors.password.message}`}</p>}
        </div>
        <button type="submit" className="bg-orange-500 text-orange-100 w-4/5 rounded h-8 mt-8">
          Log In
        </button>
      </form>
      {error && 
        <div className="py-1 px-4 bg-neutral-800 rounded border border-neutral-600 fixed mx-auto bottom-5 flex gap-2">
          <p>{error}</p>
          <CloseIcon className="text-neutral-400 w-5 cursor-pointer" onClick={() => setError(null)} />
        </div>
      }
    </>
  )
}