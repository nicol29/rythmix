"use client";

import { useForm } from "react-hook-form";
import { loginSchema, TLogInSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { GoogleIcon } from "@/assets/icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function LoginForm() {
  const { handleSubmit, register, reset, formState: { errors } } = useForm<TLogInSchema>({
    resolver: zodResolver(loginSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const processForm = async (formData: TLogInSchema) => {
    setIsSubmitting(true);

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      reset();
      toast.success("Logged in successfully");
      router.push("/register/complete-account");
    }
  }

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: '/register/complete-account' });
    toast.success("Logged in successfully");
  }

  return (
    <div className="w-4/5 py-8 bg-neutral-800 rounded border border-neutral-600 flex flex-col items-center justify-center gap-10 max-w-sm">
      <form onSubmit={handleSubmit(processForm)} className="w-4/5 flex flex-col gap-3">
        <div className="default-field-container">
          <label htmlFor="email">Email</label>
          <input className="default-input-field" type="email" id="email" {...register("email")}/>
          {errors.email && <p className="text-red-400 text-sm">{`${errors.email.message}`}</p>}
        </div>
        <div className="default-field-container">
          <label htmlFor="password">Password</label>
          <input className="default-input-field" type="password" id="password" {...register("password")} />
          {errors.password && <p className="text-red-400 text-sm">{`${errors.password.message}`}</p>}
        </div>
        <button type="submit" aria-disabled={isSubmitting} className="bg-orange-500 text-orange-100 w-full rounded h-10 mt-6 font-semibold hover:bg-orange-400">
          {isSubmitting ? "Logging In" : "Log In"}
        </button>
      </form>
      <div className="w-4/5 h-px relative bg-neutral-600 before:content-['OR'] before:absolute before:-top-2.5 before:bg-neutral-800 before:w-8 before:flex before:justify-center before:left-1/2 before:right-1/2 before:-translate-x-1/2"></div>
      <button onClick={() => handleGoogleLogin()} className="bg-white w-4/5 rounded h-10 text-neutral-600 flex items-center justify-center relative font-semibold">
        <GoogleIcon className="absolute left-2 h-3/6" /> 
        Continue with Google
      </button>
    </div>
  )
}
