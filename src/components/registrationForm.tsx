"use client";

import { useForm } from "react-hook-form";
import { registrationSchema, TRegistrationSchema } from "@/schemas/registrationSchema";
import { zodResolver } from "@hookform/resolvers/zod";


export default function RegistrationForm() {
  const { handleSubmit, register, reset, formState: { errors } } = useForm<TRegistrationSchema>({
    resolver: zodResolver(registrationSchema),
  });

  const processForm = async (formData: TRegistrationSchema) => {
    const res = await fetch("/api/auth/register", {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // reset();
  }

  return (
    <form onSubmit={handleSubmit(processForm)} className="w-4/5 py-8 bg-neutral-800 rounded border border-neutral-600 flex flex-col items-center gap-3">
      <div className="default-field-container w-4/5">
        <label htmlFor="userName">Username</label>
        <input className="default-input-field" type="text" {...register("userName", {required: "Username is required"})} />
        {errors.userName && <p className="text-red-400 text-sm">{`${errors.userName.message}`}</p>}
      </div>
      <div className="default-field-container w-4/5">
        <label htmlFor="email">Email</label>
        <input className="default-input-field" type="email" {...register("email")} />
        {errors.email && <p className="text-red-400 text-sm">{`${errors.email.message}`}</p>}
      </div>
      <div className="default-field-container w-4/5">
        <label htmlFor="userType">What are you:</label>
        <select className="default-input-field" {...register("userType")}>
          <option defaultValue="" disabled>-- Select one --</option>
          <option value="producer">Producer</option>
          <option value="artist">Artist</option>
        </select>
        {errors.userType && <p className="text-red-400 text-sm">{`${errors.userType.message}`}</p>}
      </div>
      <div className="default-field-container w-4/5">
        <label htmlFor="password">Password</label>
        <input className="default-input-field" type="password" {...register("password", {required: "Must include a password"})} />
        {errors.password && <p className="text-red-400 text-sm">{`${errors.password.message}`}</p>}
      </div>
      <div className="default-field-container w-4/5">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input className="default-input-field" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="text-red-400 text-sm">{`${errors.confirmPassword.message}`}</p>}
      </div>
      <button type="submit" className="bg-orange-500 text-orange-100 w-4/5 rounded h-8 mt-8">
        Sign Up
      </button>
    </form>
  )
}