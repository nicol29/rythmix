"use client";

import { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { DragDropAreaProps } from "@/types/uploadBeatFormTypes";
import { DropIcon, CloseIcon, CloudUploadIcon } from "@/assets/icons";
import {  } from "@/assets/icons";
import Image from "next/image";
import { removeBeatFile } from "@/server-actions/beatFile";
import { generateCloudinarySecret, uploadFileDetailsToDB } from "@/server-actions/beatFile";
import { useSession } from "next-auth/react";


export default function DragDropArea({ 
  filesState, 
  dispatch, 
  styles, 
  beatUrl, 
  dropZoneName, 
  dropZoneOptions,
  beatID
}: DragDropAreaProps) {
  const { data: session } = useSession();
  const [isAssetUploading, setIsAssetUploading] = useState(false);


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      if (filesState.errorMsg) dispatch({ type: "REMOVE_ERROR", payload: { dropzone: dropZoneName }});
      setIsAssetUploading(true);

      const res = await uploadBeatFile(dropZoneName, acceptedFiles[0]);
      setIsAssetUploading(false);

      if (res?.success) dispatch({ type: "SET_ACCEPTED_FILE", payload: { dropzone: dropZoneName, acceptedFile: { ...res.asset } }});
    } 
  }, [dropZoneName, filesState.errorMsg, dispatch]);

  const uploadBeatFile = async (fileName: string, fileToUpload: File) => {
    const response = await generateCloudinarySecret(beatID, fileName);

    if (!response?.success) return;

    const { signature, timestamp, api_key, cloud_name } = response.info;

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    formData.append('folder', `users/${session?.user.id}/beats/${beatID}`);
    formData.append('public_id', fileName);
    formData.append('overwrite', 'true');

    try {
      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await uploadResponse.json();

      console.log(data)
      if (data.secure_url) {
        await uploadFileDetailsToDB(
          beatID, 
          data.secure_url, 
          data.public_id, 
          data.original_filename,
          fileName
        );
      }

      return { success: true, asset: { url: data.secure_url, publicId: data.public_id, fileName: data.original_filename }}
    } catch (error) {
      console.error('Upload failed', error);
    }
  }

  const { getRootProps, getInputProps, open, isDragActive, fileRejections } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    noDrag: !!filesState.acceptedFile || !!isAssetUploading,
    maxFiles: 1,
    ...dropZoneOptions,
  })

  const deleteFiles = async (fileType: "video" | "image") => {
    const res = await removeBeatFile(beatUrl, dropZoneName, fileType);

    if (res?.success) dispatch({ type: "REMOVE_ACCEPTED_FILE", payload: { dropzone: dropZoneName } });
  }

  return (
    <>
      <div {...getRootProps({ className: `${styles}` })}>
        <input {...getInputProps()} />
          { !filesState.acceptedFile && !isAssetUploading &&
            <div className="flex flex-col items-center gap-4">
              <DropIcon className="text-neutral-600 h-8" />
              {
                isDragActive ?
                  <p className="text-sm">Drop the file here ...</p> :
                  <>
                    <p className="text-sm">Drop file here, or click to select file</p>
                    <button type="button" onClick={() => open()} className="bg-neutral-700 text-sm px-2 rounded border border-neutral-500">Browse File</button>
                  </>
              }
            </div>
          }
          {
            isAssetUploading &&
            <div className="absolute h-full w-full flex items-center justify-center"> 
              <div className="flex gap-2">
                <p className="italic">Uploading...</p>
                <CloudUploadIcon className="h-6 w-6 bounce-animation" />
              </div>
            </div>
          }
          {
            dropZoneName === "artwork" && filesState.acceptedFile ?
            (
              <div className="absolute h-full w-full">
                <Image 
                  src={`${filesState.acceptedFile.url}`} 
                  priority 
                  fill 
                  sizes="w-full h-full" 
                  className="h-full w-full object-cover rounded" 
                  alt="User uploaded image"
                />
                <div onClick={() => deleteFiles("image")} className="absolute top-2 right-2 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer bg-neutral-400 hover:bg-neutral-200 hover:opacity-80">
                  <CloseIcon className="h-5 text-neutral-700" />
                </div>
              </div>
            ) :
            (
              dropZoneName !== "artwork" && filesState.acceptedFile ?
              (
                <p className="text-orange-500 font-semibold">
                  {filesState.acceptedFile.fileName}
                  <span><CloseIcon onClick={() => deleteFiles("video")} className="h-5 inline cursor-pointer ml-2 mb-0.5"/></span>
                </p>
              ) : null
            )
          }
      </div>
      {
        fileRejections.length > 0 &&
        <p className="text-red-400 text-sm">{fileRejections[0].errors[0].message}</p>
      }
    </>
  )
}