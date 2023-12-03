"use client";

import { useForm } from "react-hook-form";
import { any } from "zod";


export default function RegistrationForm() {
  const { handleSubmit, register, formState: { errors } } = useForm();

  return (
    <form className="w-4/5 py-8 bg-neutral-800 rounded border border-neutral-600 flex flex-col items-center gap-3">
      <div className="default-field-container w-4/5">
        <label htmlFor="firstName">First Name</label>
        <input className="default-input-field" type="text" {...register("firstName")} />
        <p></p>
      </div>
      <div className="default-field-container w-4/5">
        <label htmlFor="secondName">Second Name</label>
        <input className="default-input-field" type="text" {...register("secondName")} />
        <p></p>
      </div>
      <div className="default-field-container w-4/5">
        <label htmlFor="userType">What are you:</label>
        <select className="default-input-field" {...register("userType")}>
          <option value="producer">Producer</option>
          <option value="artist">Artist</option>
        </select>
        <p></p>
      </div>
      <div className="default-field-container w-4/5">
        <label htmlFor="email">Email</label>
        <input className="default-input-field" type="email" {...register("email")} />
        <p></p>
      </div>
      <div className="default-field-container w-4/5">
        <label htmlFor="password">Password</label>
        <input className="default-input-field" type="password" {...register("password")} />
        <p></p>
      </div>
      <div className="default-field-container w-4/5">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input className="default-input-field" type="password" {...register("confirmPassword")} />
        <p></p>
      </div>
      <button className="bg-orange-500 text-orange-100 w-4/5 rounded h-8 mt-8">
        Sign Up
      </button>
    </form>
  )
}