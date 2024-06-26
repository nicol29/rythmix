"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { completeAccountSchema, TCompleteAccountSchema } from "@/schemas/completeAccountSchema";
import addExtraAccountInfo from "@/server-actions/addExtraAccountInfo";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function CompleteAccountForm() {
  const { handleSubmit, register, formState: { errors } } = useForm<TCompleteAccountSchema>({
    resolver: zodResolver(completeAccountSchema),
  });
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const processForm = async (formData: TCompleteAccountSchema) => {
    const authenticatedUser = session?.user;

    if (authenticatedUser) {
      setIsSubmitting(true);

      const { id, isProfileCompleted } = authenticatedUser; 
      const res = await addExtraAccountInfo(formData, {id, isProfileCompleted});

      setIsSubmitting(false);

      if (res.success) {
        update({
          userName: formData.userName,
          userType: formData.userType,
          isProfileCompleted: true
        });
        toast.success(res.message);
        router.push("/");
      } else {
        toast.error(res.message);
      }
    }
  }

  return (
    <div className="w-4/5 py-8 bg-neutral-800 rounded border border-neutral-600 flex flex-col items-center justify-center gap-10 max-w-sm">
      <form onSubmit={handleSubmit(processForm)} className="w-4/5 flex flex-col gap-3">
        <div className="default-field-container">
          <label htmlFor="userName">Username</label>
          <input className="default-input-field" type="text" id="userName" {...register("userName")} />
          {errors.userName && <p className="text-red-400 text-sm">{`${errors.userName.message}`}</p>}
        </div>
        <div className="default-field-container">
          <label htmlFor="userType">What are you:</label>
          <select className="default-input-field" id="userType" {...register("userType")}>
            <option defaultValue="" disabled>-- Select one --</option>
            <option value="producer">Producer</option>
            <option value="artist">Artist</option>
          </select>
          {errors.userType && <p className="text-red-400 text-sm">{`${errors.userType.message}`}</p>}
        </div>
        <button type="submit" aria-disabled={isSubmitting} className="bg-orange-500 text-orange-100 rounded h-10 mt-8 font-semibold">
          {isSubmitting ? "Finishing Up" : "Finish Up"}
        </button>
      </form>
    </div>
  )
}