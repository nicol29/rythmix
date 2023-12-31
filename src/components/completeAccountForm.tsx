"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { completeAccountSchema, TCompleteAccountSchema } from "@/schemas/completeAccountSchema";


export default function CompleteAccountForm() {
  const { handleSubmit, register, reset, formState: { errors } } = useForm<TCompleteAccountSchema>({
    resolver: zodResolver(completeAccountSchema),
  });

  const processForm = async (formData: TCompleteAccountSchema) => {

    const response = await fetch("/api/auth/register", {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // reset();
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
          <label htmlFor="userType">What are you:</label>
          <select className="default-input-field" {...register("userType")}>
            <option defaultValue="" disabled>-- Select one --</option>
            <option value="producer">Producer</option>
            <option value="artist">Artist</option>
          </select>
          {errors.userType && <p className="text-red-400 text-sm">{`${errors.userType.message}`}</p>}
        </div>
        <button type="submit" className="bg-orange-500 text-orange-100 rounded h-10 mt-8 font-semibold">
          Finish Up
        </button>
      </form>
    </div>
  )
}