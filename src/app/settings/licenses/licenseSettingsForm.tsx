"use client";

import { LicenseTermsInterface } from "@/types/mongoDocTypes";
import { TLicenseSettingsSchema, licenseSettingsSchema } from "@/schemas/licenseSettingsSchema";
import Modal from "@/components/Modal/modal";
import { useForm } from "react-hook-form";
import { updateLicenseSetting } from "@/server-actions/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloseIcon } from "@/assets/icons";
import { useState } from "react";
import { toast } from "sonner";
import { createContract } from "@/utils/createContract";


export default function LicenseSettingsForm({ 
  licenseName,
  licenseTerms,
  userId
}: {
  licenseName: "Basic" | "Premium" | "Exclusive";
  licenseTerms: LicenseTermsInterface;
  userId: string;
}) {
  const { handleSubmit, register, formState: { errors } } = useForm<TLicenseSettingsSchema>({
    resolver: zodResolver(licenseSettingsSchema),
    defaultValues: {
      distributionCopies: licenseTerms.distributionCopies ?? "",
      audioStreams: licenseTerms.audioStreams ?? "",
      musicVideos: licenseTerms.musicVideos ?? "",
      radioStations: licenseTerms.radioStations ?? "",
      allowProfitPerformances: licenseTerms.allowProfitPerformances === true ? "true" : "false",
      country: licenseTerms.country ?? "",
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const processForm = async (formData: TLicenseSettingsSchema) => {
    setIsSubmitting(true);

    const res = await updateLicenseSetting(formData, licenseName.toLowerCase(), userId);

    setIsSubmitting(false);

    if (res?.success) toast.success(res.message);
  }

  return (
    <>
      <div>
        <div>
          <h2 className="text-2xl mb-6">{licenseName} License Terms</h2>
          <form onSubmit={handleSubmit(processForm)} className="w-full flex flex-col gap-5">
            <div className="w-full flex flex-col gap-5 lg:flex-row">
              <div className="default-field-container lg:flex-1">
                <label htmlFor="distributionCopies">Max Distribution Copies</label>
                <input className="dark-input-field" placeholder="Enter a number or the word Unlimited" type="text" id="distributionCopies" {...register("distributionCopies")}/>
                {errors.distributionCopies && <p className="text-red-400 text-sm">{`${errors.distributionCopies.message}`}</p>}
              </div>
              <div className="default-field-container lg:flex-1">
                <label htmlFor="audioStreams">Max Audio Streams</label>
                <input className="dark-input-field" placeholder="Enter a number or the word Unlimited" type="text" id="audioStreams" {...register("audioStreams")}/>
                {errors.audioStreams && <p className="text-red-400 text-sm">{`${errors.audioStreams.message}`}</p>}
              </div>
            </div>
            <div className="w-full flex flex-col gap-5 lg:flex-row">
              <div className="default-field-container lg:flex-1">
                <label htmlFor="musicVideos">Max Music Videos</label>
                <input className="dark-input-field" placeholder="Enter a number or the word Unlimited" type="text" id="musicVideos" {...register("musicVideos")}/>
                {errors.musicVideos && <p className="text-red-400 text-sm">{`${errors.musicVideos.message}`}</p>}
              </div>
              <div className="default-field-container lg:flex-1">
                <label htmlFor="radioStations">Max Radio Station</label>
                <input className="dark-input-field" placeholder="Enter a number or the word Unlimited" type="text" id="radioStations" {...register("radioStations")}/>
                {errors.radioStations && <p className="text-red-400 text-sm">{`${errors.radioStations.message}`}</p>}
              </div>
            </div>
            <div className="w-full flex flex-col gap-5 lg:flex-row">
              <div className="default-field-container lg:flex-1">
                <label htmlFor="allowProfitPerformances">Allow Profit Performances</label>
                <select id="allowProfitPerformances" className="dark-input-field" {...register("allowProfitPerformances")}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {errors.allowProfitPerformances && <p className="text-red-400 text-sm">{`${errors.allowProfitPerformances.message}`}</p>}
              </div>
              <div className="default-field-container lg:flex-1">
                <label htmlFor="country">Country</label>
                <input className="dark-input-field" placeholder="Enter a country" type="text" id="country" {...register("country")}/>
                {errors.country && <p className="text-red-400 text-sm">{`${errors.country.message}`}</p>}
              </div>
            </div>
            <button type="submit" aria-disabled={isSubmitting} className="bg-orange-500 text-orange-100 w-full rounded h-10 mt-6 font-semibold hover:bg-orange-400 lg:w-fit lg:px-6 lg:self-end">
              {isSubmitting ? "Saving Changes" : "Save Changes"}
            </button>
          </form>
        </div>
        <div className="flex justify-end mt-2">
          <span onClick={() => setIsModalOpen(true)} className="text-orange-500 font-medium cursor-pointer">View license</span>
        </div>
      </div>
      <Modal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        styles={"w-8/12 h-[500px]"}
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <span className="text-xl">{licenseName} Contract</span>
            <CloseIcon onClick={() => setIsModalOpen(false)} className="h-4 w-4" />
          </div>
          <div className="overflow-y-auto max-h-[400px]">
            <pre className="whitespace-pre-wrap break-words text-sm">{previewContract()}</pre>
          </div>
        </div>
      </Modal>
    </>
  )
}