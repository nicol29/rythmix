"use client";

import { useForm } from "react-hook-form";
import loginSchema from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";


export default function LoginForm() {
  const { handleSubmit, register, reset, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const processForm = (data: any) => {
    console.log("fdbdfb");

    reset();
  }

  return (
    <form onSubmit={handleSubmit(processForm)} className="w-4/5 py-8 bg-neutral-800 rounded border border-neutral-600 flex flex-col items-center gap-3">
      <div className="default-field-container w-4/5">
        <label htmlFor="email">Email</label>
        <input className="default-input-field" type="email" {...register("email")} />
        {errors.email && <p className="text-red-400 text-sm">{`${errors.email.message}`}</p>}
      </div>
      <div className="default-field-container w-4/5">
        <label htmlFor="password">Password</label>
        <input className="default-input-field" type="password" {...register("password", {required: "Must include a password"})} />
        {errors.password && <p className="text-red-400 text-sm">{`${errors.password.message}`}</p>}
      </div>
      <button type="submit" className="bg-orange-500 text-orange-100 w-4/5 rounded h-8 mt-8">
        Sign Up
      </button>
    </form>
  )
}