"use client";

import { useForm } from "react-hook-form";
import { registrationSchema, TRegistrationSchema } from "@/schemas/registrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleIcon } from "@/assets/icons";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useRedirectOnProfileCompletion from "@/hooks/useRedirectOnProfileCompletion";
import { toast } from "sonner";
import addUser from "@/server-actions/addUser";


export default function RegistrationForm() {
  // useRedirectOnProfileCompletion();
  const { handleSubmit, register, reset, formState: { errors } } = useForm<TRegistrationSchema>({
    resolver: zodResolver(registrationSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  

  const processForm = async (formData: TRegistrationSchema) => {
    setIsSubmitting(true);
  
    const res = await addUser(formData);

    if (res.success) {
      toast.success(res.message)
      router.push("/login");
    } else {
      toast.error(res.message);
      if (!!res.userExists) router.push("/login");
    }

    setIsSubmitting(false);
    reset();
  }

  return (
    <div className="w-4/5 py-8 bg-neutral-800 rounded border border-neutral-600 flex flex-col items-center justify-center gap-10 max-w-sm">
      <form onSubmit={handleSubmit(processForm)} className="w-4/5 flex flex-col gap-3">
        <div className="default-field-container">
          <label htmlFor="email">Email</label>
          <input className="default-input-field" type="email" {...register("email")} />
          {errors.email && <p className="text-red-400 text-sm">{`${errors.email.message}`}</p>}
        </div>
        <div className="default-field-container">
          <label htmlFor="password">Password</label>
          <input className="default-input-field" type="password" {...register("password", {required: "Must include a password"})} />
          {errors.password && <p className="text-red-400 text-sm">{`${errors.password.message}`}</p>}
        </div>
        <div className="default-field-container">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input className="default-input-field" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-red-400 text-sm">{`${errors.confirmPassword.message}`}</p>}
        </div>
        <button type="submit" aria-disabled={isSubmitting} className="bg-orange-500 text-orange-100 rounded h-10 mt-8 font-semibold hover:bg-orange-400">
          {isSubmitting ? "Signing Up" : "Sign Up"}
        </button>
      </form>
      <div className="w-4/5 h-px relative bg-neutral-600 before:content-['OR'] before:absolute before:-top-2.5 before:bg-neutral-800 before:w-8 before:flex before:justify-center before:left-1/2 before:right-1/2 before:-translate-x-1/2"></div>
        <button onClick={() => signIn("google")} className="bg-white w-4/5 rounded h-10 text-neutral-600 flex items-center justify-center relative font-semibold">
          <GoogleIcon className="absolute left-2 h-3/6" /> 
          Continue with Google
        </button>
    </div>
  )
}