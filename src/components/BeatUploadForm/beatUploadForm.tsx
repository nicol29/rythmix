"use client";

import { useReducer, useEffect } from "react";
import DragDropArea from "./dragDropArea";
import { FileState } from "@/types/uploadBeatFormTypes";
import fileReducer from "@/reducers/fileReducer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TBeatUploadSchema, beatUploadSchema } from "@/schemas/beatUploadSchema";
import InfoIcon from "../InfoIcon/infoIcon";


export default function BeatUploadForm() {
  const initialState: FileState = {
    artworkFile: { acceptedFile: null, rejectedFile: null },
    mp3File: { acceptedFile: null, rejectedFile: null },
    wavFile: { acceptedFile: null, rejectedFile: null }
  }

  const [state, dispatch] = useReducer(fileReducer, initialState);

  const { handleSubmit, register, reset, formState: { errors } } = useForm<TBeatUploadSchema>({
    resolver: zodResolver(beatUploadSchema),
  });

  useEffect(() => {
    console.log(state);
  }, [state]);

  const artWorkDropZoneStyles = `${state.artworkFile.acceptedFile ? '' : 'border-dashed'} flex items-center p-5 text-center justify-center bg-neutral-850 w-full aspect-square rounded border-2 border-neutral-700 relative`;
  const audioFilesDropZoneStyles = `${state.mp3File.acceptedFile ? '' : 'border-dashed'} flex items-center px-5 py-3 text-center justify-center bg-neutral-850 w-full min-h-[100px] rounded border-2 border-neutral-700 relative`;

  return (
    <form action="" className="flex flex-col gap-14 px-4 max-w-[325px] lg:max-w-none lg:grid lg:grid-rows-3 lg:grid-cols-3 ">
      <div className="flex flex-col gap-5 lg:col-start-3 lg:row-span-2 lg:w-[325px]">
        <h2 className="text-2xl">Assets</h2>
        <div>
          <div>
            <p className="mb-2">Artwork *</p>
          </div>
          <DragDropArea 
            filesState={state.artworkFile} 
            dispatch={dispatch} 
            styles={artWorkDropZoneStyles} 
            dropZoneName={"artworkFile"}
            dropZoneOptions={{
              accept: {
                'image/png': ['.png', '.jpeg', '.jpg'],
              },
              maxSize: 3 * 1024 * 1024,
              minSize: 500 * 500,
            }}
          />
        </div>
        <div>
          <p className="mb-2">MP3</p>
          <DragDropArea 
            filesState={state.mp3File} 
            dispatch={dispatch} 
            styles={audioFilesDropZoneStyles} 
            dropZoneName={"mp3File"}
            dropZoneOptions={{
              accept: {
                'audio/mpeg': ['.mp3'],
              },
              maxSize: 7000000,  // Approximate size for a 7-minute MP3 at 128 kbps
              minSize: 1500000,
            }}
          />
        </div>
        <div>
          <p className="mb-2">WAV</p>
          <DragDropArea 
            filesState={state.wavFile} 
            dispatch={dispatch} 
            styles={audioFilesDropZoneStyles} 
            dropZoneName={"wavFile"}
            dropZoneOptions={{
              accept: {
                'audio/wav': ['.wav'],
              },
              maxSize: 80000000,  // Approximate size for a 7-minute WAV file
              minSize: 10000000, 
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 md:row-start-1 lg:row-start-1 lg:col-span-2 lg:max-w-[650px]">
        <h2 className="text-2xl">Details</h2>
        <div className="default-field-container">
          <label className="mb-2" htmlFor="title">Title *</label>
          <input className="dark-input-field" type="text" id="title" {...register("title")}/>
          {errors.title && <p className="text-red-400 text-sm">{`${errors.title.message}`}</p>}
        </div>
        <div>
          <p className="mb-2">License(s) *</p>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-6">
            <div className="bg-neutral-850 rounded border border-neutral-700 px-2 py-1 flex flex-col gap-1 cursor-pointer hover:bg-neutral-800 hover:border-neutral-600">
              <p>Basic License</p>
              <div className="text-orange-500 font-semibold">€<input defaultValue={25} className="w-12 bg-transparent ml-1 border-neutral-700" /></div>
              <p className="text-sm text-neutral-400 font-light">.mp3 format</p>
            </div>
            <div className="bg-neutral-850 rounded border border-neutral-700 px-2 py-1 flex flex-col gap-1 cursor-pointer hover:bg-neutral-800 hover:border-neutral-600">
              <p>Premium License</p>
              <div className="text-orange-500 font-semibold">€<input defaultValue={75} className="w-12 bg-transparent ml-1 border-neutral-700" /></div>
              <p className="text-sm text-neutral-400 font-light">.wav format</p>
            </div>
            <div className="bg-neutral-850 rounded border border-neutral-700 px-2 py-1 flex flex-col gap-1 cursor-pointer hover:bg-neutral-800 hover:border-neutral-600">
              <p>Exclusive License</p>
              <div className="text-orange-500 font-semibold">€<input defaultValue={749} className="w-12 bg-transparent ml-1 border-neutral-700" /></div>
              <p className="text-sm text-neutral-400 font-light">.wav format</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:col-span-2 lg:max-w-[650px]">
        <div className="flex mb-4 items-center gap-2">
          <h2 className="text-2xl">Metadata</h2>
          <InfoIcon dialogueText="Helps improve beat discoverability in searches" />
        </div>
        <div className="grid grid-cols-2 gap-2 lg:gap-6">
          <div className="default-field-container">
            <label className="mb-2" htmlFor="title">Bpm</label>
            <input className="dark-input-field" type="text" id="title" {...register("title")}/>
            {errors.title && <p className="text-red-400 text-sm">{`${errors.title.message}`}</p>}
          </div>
          <div className="default-field-container">
            <label className="mb-2" htmlFor="title">Key</label>
            <input className="dark-input-field" type="text" id="title" {...register("title")}/>
            {errors.title && <p className="text-red-400 text-sm">{`${errors.title.message}`}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 lg:gap-6">
          <div className="default-field-container">
            <label className="mb-2" htmlFor="title">Genre</label>
            <input className="dark-input-field" type="text" id="title" {...register("title")}/>
            {errors.title && <p className="text-red-400 text-sm">{`${errors.title.message}`}</p>}
          </div>
          <div className="default-field-container">
            <label className="mb-2" htmlFor="title">Mood</label>
            <input className="dark-input-field" type="text" id="title" {...register("title")}/>
            {errors.title && <p className="text-red-400 text-sm">{`${errors.title.message}`}</p>}
          </div>
        </div>
      </div>
      <div className="max-w-[325px] lg:col-start-3">
        <button className="bg-white text-neutral-600 w-full rounded h-10 font-semibold hover:bg-neutral-300">Save as Draft</button>
        <button className="bg-orange-500 text-orange-100 w-full rounded h-10 mt-4 font-semibold hover:bg-orange-400">Publish</button>
      </div>
    </form>
  )
}