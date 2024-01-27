"use client";

import { useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { DragDropAreaProps } from "@/types/uploadBeatFormTypes";
import { DropIcon } from "@/assets/icons";
import { CloseIcon } from "@/assets/icons";
import Image from "next/image";


export default function DragDropArea({ filesState, dispatch, styles, dropZoneName, dropZoneOptions }: DragDropAreaProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const acceptedFile = acceptedFiles[0];
      if (dropZoneName === "artworkFile") Object.assign(acceptedFile, { preview: URL.createObjectURL(acceptedFile) });
      
      dispatch({ type: "SET_ACCEPTED_FILE", payload: { dropzone: dropZoneName, acceptedFile }});
      dispatch({ type: "REMOVE_ERROR", payload: { dropzone: dropZoneName }});
    } 
  }, []);

  const { getRootProps, getInputProps, open, isDragActive, fileRejections } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    noDrag: !!filesState.acceptedFile,
    maxFiles: 1,
    ...dropZoneOptions,
  })

  const removeAsset = () => {
    dispatch({ type: "REMOVE_ACCEPTED_FILE", payload: { dropzone: dropZoneName } });
  }

  return (
    <>
      <div {...getRootProps({ className: `${styles}` })}>
        <input {...getInputProps()} />
          { !filesState.acceptedFile &&
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
            dropZoneName === "artworkFile" && filesState.acceptedFile ?
            (
              <div className="absolute h-full w-full">
                <Image src={`${filesState.acceptedFile.preview}`} fill className="h-full w-full object-cover rounded" alt="" />
                {/* <img src={`${filesState.acceptedFile.preview}`} className="h-full w-full object-cover rounded" alt="" />  */}
                <div onClick={() => removeAsset()} className="absolute top-2 right-2 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer bg-neutral-400 hover:bg-neutral-200 hover:opacity-80">
                  <CloseIcon className="h-5 text-neutral-700" />
                </div>
              </div>
            ) :
            (
              dropZoneName !== "artworkFile" && filesState.acceptedFile ?
              (
                <p className="text-orange-500 font-semibold">
                  {filesState.acceptedFile.path}
                  <span><CloseIcon onClick={() => removeAsset()} className="h-5 inline cursor-pointer ml-2 mb-0.5"/></span>
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