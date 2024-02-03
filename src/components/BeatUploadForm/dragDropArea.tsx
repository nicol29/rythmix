"use client";

import { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { DragDropAreaProps } from "@/types/uploadBeatFormTypes";
import { DropIcon } from "@/assets/icons";
import { CloseIcon } from "@/assets/icons";
import Image from "next/image";
import { addBeatFile, removeBeatFile } from "@/server-actions/beatFile";


export default function DragDropArea({ 
  filesState, 
  dispatch, 
  styles, 
  beatUrl, 
  dropZoneName, 
  dropZoneOptions 
}: DragDropAreaProps) {
  const [isAssetUploading, setIsAssetUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      if (filesState.errorMsg) dispatch({ type: "REMOVE_ERROR", payload: { dropzone: dropZoneName }});
      setIsAssetUploading(true);

      const filesFormData = new FormData();
      filesFormData.append(dropZoneName, acceptedFiles[0]);

      const res = await addBeatFile(filesFormData, beatUrl, dropZoneName);
      setIsAssetUploading(false);

      if (res?.success) dispatch({ type: "SET_ACCEPTED_FILE", payload: { dropzone: dropZoneName, acceptedFile: { ...res.asset } }});
    } 
  }, [dropZoneName, filesState.errorMsg, dispatch, beatUrl]);

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
              <p className="italic">Uploading...</p>
            </div>
          }
          {
            dropZoneName === "artwork" && filesState.acceptedFile ?
            (
              <div className="absolute h-full w-full">
                <Image src={`${filesState.acceptedFile.url}`} fill sizes="w-full h-full" className="h-full w-full object-cover rounded" alt="User uploaded image" />
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