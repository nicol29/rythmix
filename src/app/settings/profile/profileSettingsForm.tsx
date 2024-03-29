"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { profileSettingsSchema, TProfileSettingsSchema } from "@/schemas/profileSettingsSchema";
import Image from "next/image";
import Modal from "@/components/Modal/modal";
import DragDropAreaProfilePicture from "./dragDropAreaPicture";
import { CloseIcon } from "@/assets/icons";
import { useSession } from "next-auth/react";
import { updateProfileInfo } from "@/server-actions/settings";


export default function ProfileSettingsForm({
  profileSettings
}: {
  profileSettings: {
    userName: string;
    profileUrl: string;
    biography: string | null;
    country: string | null;
  }
}) {
  const { handleSubmit, register, setError, formState: { errors } } = useForm<TProfileSettingsSchema>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      userName: profileSettings?.userName,
      profileUrl: profileSettings?.profileUrl,
      biography: profileSettings?.biography ?? "",
      country: profileSettings?.country ?? "",
    }
  });
  const { data: session, update } = useSession();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const processForm = async (formData: TProfileSettingsSchema) => {
    setIsSubmitting(true);

    const res = await updateProfileInfo(formData, session?.user.id);

    setIsSubmitting(false);

    if (res?.success) {
      update({
        ...session?.user,
        userName: formData.userName,
        profileUrl: formData.profileUrl,
      });
    } else {
      if (res.duplicateKey) {
        setError("profileUrl", {
          message: res.message
        });
      }
    }
  }

  return (
    <>
      <div className="flex justify-between">
        <div className="relative h-24 aspect-square bg-neutral-800 rounded">
          { session?.user.image &&
            <Image 
              src={`${session.user.image ?? ""}`} 
              priority 
              fill 
              sizes="w-full h-full" 
              className="h-full w-full object-cover rounded" 
              alt="User uploaded image"
            />
          }
        </div>
        <button onClick={() => setIsModalOpen(true)} className="default-orange-button self-end px-2 py-1">Change Profile Image</button>
      </div>
      <form onSubmit={handleSubmit(processForm)} className="w-full flex flex-col gap-5">
        <div className="default-field-container">
          <label htmlFor="userName">Username</label>
          <input className="dark-input-field" type="text" id="userName" {...register("userName")}/>
          {errors.userName && <p className="text-red-400 text-sm">{`${errors.userName.message}`}</p>}
        </div>
        <div className="default-field-container">
          <label htmlFor="profileUrl">Profile Url</label>
          <input className="dark-input-field" type="text" id="profileUrl" {...register("profileUrl")}/>
          {errors.profileUrl && <p className="text-red-400 text-sm">{`${errors.profileUrl.message}`}</p>}
        </div>
        <div className="default-field-container">
          <label htmlFor="country">Country</label>
          <input className="dark-input-field" type="text" id="country" {...register("country")}/>
          {errors.country && <p className="text-red-400 text-sm">{`${errors.country.message}`}</p>}
        </div>
        <div className="default-field-container">
          <label htmlFor="biography">Biography</label>
          <textarea className="dark-input-field resize-none min-h-[200px]" id="biography" {...register("biography")} />
          {errors.biography && <p className="text-red-400 text-sm">{`${errors.biography.message}`}</p>}
        </div>
        <button type="submit" aria-disabled={isSubmitting} className="bg-orange-500 text-orange-100 w-full rounded h-10 mt-6 font-semibold hover:bg-orange-400 lg:w-fit lg:px-6 lg:self-end">
          {isSubmitting ? "Saving Changes" : "Save Changes"}
        </button>
      </form>
      <Modal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <span className="text-xl">Upload Profile Picture</span>
            <CloseIcon onClick={() => setIsModalOpen(false)} className="h-4 w-4" />
          </div>
          <DragDropAreaProfilePicture 
            closeModal={() => setIsModalOpen(false)}
          />
        </div>
      </Modal>
    </>
  )
}