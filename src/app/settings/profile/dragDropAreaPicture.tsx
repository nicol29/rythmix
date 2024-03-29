"use client";

import { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { DropIcon, CloudUploadIcon, Spinner } from "@/assets/icons";
import { addProfilePicture } from "@/server-actions/addProfilePicture";
import { useSession } from "next-auth/react";
import { toast } from "sonner";


export default function DragDropAreaProfilePicture({ 
  closeModal,
}: {
  closeModal: () => void;
}) {
  const [isAssetUploading, setIsAssetUploading] = useState(false);
  const { data: session, update } = useSession();


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      setIsAssetUploading(true);

      const filesFormData = new FormData();
      filesFormData.append("profilePicture", acceptedFiles[0]);

      const res = await addProfilePicture(filesFormData);

      setIsAssetUploading(false);
      if (res?.success) {
        update({
          ...session?.user,
          image: res?.accessUrl,
        });

        toast.success("Image changed successfully");
      }

      closeModal();
    } 
  }, [closeModal, session?.user, update]);
  

  const { getRootProps, getInputProps, open, isDragActive, fileRejections } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    accept: {
      'image/png': ['.png', '.jpeg', '.jpg'],
    },
    minSize: 200 * 200,
  });

  return (
    <>
      <div {...getRootProps({ className: `border-dashed flex items-center p-5 text-center justify-center bg-neutral-850 w-full aspect-square rounded border-2 border-neutral-700 relative` })}>
        <input {...getInputProps()} />
          { !isAssetUploading &&
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
      </div>
      {
        fileRejections.length > 0 &&
        <p className="text-red-400 text-sm">{fileRejections[0].errors[0].message}</p>
      }
    </>
  )
}