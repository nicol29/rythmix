"use client";

import { useForm } from "react-hook-form";
import { registrationSchema, TRegistrationSchema } from "@/schemas/registrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "@/assets/icons";
import { signIn } from "next-auth/react";


export default function RegistrationForm() {
  const { handleSubmit, register, reset, formState: { errors } } = useForm<TRegistrationSchema>({
    resolver: zodResolver(registrationSchema),
  });

  const router = useRouter();

  const processForm = async (formData: TRegistrationSchema) => {

    const response = await fetch("/api/auth/register", {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errorCode === "EMAIL_EXISTS") router.push(`/login?email=${encodeURIComponent(data.email)}`);
    }

    reset();
  }

  return (
    <div className="w-4/5 py-8 bg-neutral-800 rounded border border-neutral-600 flex flex-col items-center justify-center gap-10 max-w-sm">
      <form onSubmit={handleSubmit(processForm)} className="w-4/5 flex flex-col gap-3">
        <div className="default-field-container">
          <label htmlFor="userName">Username</label>
          <input className="default-input-field" type="text" {...register("userName", {required: "Username is required"})} />
          {errors.userName && <p className="text-red-400 text-sm">{`${errors.userName.message}`}</p>}
        </div>
        <div className="default-field-container">
          <label htmlFor="email">Email</label>
          <input className="default-input-field" type="email" {...register("email")} />
          {errors.email && <p className="text-red-400 text-sm">{`${errors.email.message}`}</p>}
        </div>
        <div className="default-field-container">
          <label htmlFor="userType">What are you:</label>
          <select className="default-input-field" {...register("userType")}>
            <option defaultValue="" disabled>-- Select one --</option>
            <option value="producer">Producer</option>
            <option value="artist">Artist</option>
          </select>
          {errors.userType && <p className="text-red-400 text-sm">{`${errors.userType.message}`}</p>}
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
        <button type="submit" className="bg-orange-500 text-orange-100 rounded h-8 mt-8 font-semibold">
          Sign Up
        </button>
      </form>
      <div className="w-4/5 h-px relative bg-neutral-600 before:content-['OR'] before:absolute before:-top-2.5 before:bg-neutral-800 before:w-8 before:flex before:justify-center before:left-1/2 before:right-1/2 before:-translate-x-1/2"></div>
        <button onClick={() => signIn("google")} className="bg-white w-4/5 rounded h-8 text-neutral-600 flex items-center justify-center relative font-semibold">
          <GoogleIcon className="h-4/6 absolute left-1" /> 
          Continue with Google
        </button>
    </div>
  )
}