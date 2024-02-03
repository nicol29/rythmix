"use client";

import { useReducer, useState } from "react";
import DragDropArea from "./dragDropArea";
import { FileState } from "@/types/uploadBeatFormTypes";
import fileReducer from "@/reducers/fileReducer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TBeatUploadSchema, beatUploadSchema } from "@/schemas/beatUploadSchema";
import InfoIcon from "../InfoIcon/infoIcon";
import { toast } from "sonner";
import addBeat from "@/server-actions/addBeat";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";


export default function BeatUploadForm({ slug, currentBeat }: { slug: string, currentBeat?: BeatDocumentInterface }) {
  const artWorkUrl = currentBeat?.assets.artwork.url;
  const initialFileState: FileState = {
    artworkFile: { acceptedFile: null, errorMsg: null },
    mp3File: { acceptedFile: null, errorMsg: null },
    wavFile: { acceptedFile: null, errorMsg: null }
  }
  const [fileState, dispatch] = useReducer(fileReducer, initialFileState);
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const [isPublishLoading, setIsPublishLoading] = useState(false);

  const { handleSubmit, register, setValue, getValues, watch, formState: { errors } } = useForm<TBeatUploadSchema>({
    resolver: zodResolver(beatUploadSchema),
    defaultValues: {
      title: currentBeat?.title ?? "",
      bpm: currentBeat?.bpm ?? "",
      key: currentBeat?.key ?? "",
      genre: currentBeat?.genre ?? "",
      mood: currentBeat?.mood ?? "",
      licenses: {
        basic: {
          price: currentBeat?.licenses.basic.price ?? 25.00,
          selected: currentBeat?.licenses.basic.selected ?? false
        },
        premium: {
          price: currentBeat?.licenses.premium.price ?? 50.00,
          selected: currentBeat?.licenses.premium.selected ?? false
        }, 
        exclusive: {
          price: currentBeat?.licenses.exclusive.price ?? 700.00,
          selected: currentBeat?.licenses.exclusive.selected ?? false
        }
      }
    },
  });

  const watchLicenses = watch("licenses");

  const manageLicenseSelection = (licenseName: "basic" | "premium" | "exclusive") => {
    dispatch({ type: "REMOVE_ALL_ERRORS", payload: { dropzone: "mp3File" }});
    const currentSelected = watchLicenses[licenseName].selected;

    if (licenseName === "exclusive") {
      setValue("licenses.basic.selected", false);
      setValue("licenses.premium.selected", false);
    } else {
      setValue("licenses.exclusive.selected", false);
    }

    setValue(`licenses.${licenseName}.selected`, !currentSelected);
  }

  const verifyFilesAreSubmitted = (formData: TBeatUploadSchema) => {
    const { licenses } = formData;
    let noErrors = true;

    if (!fileState.mp3File.acceptedFile) {
      dispatch({ type: "SET_ERROR", payload: { dropzone: "mp3File", error: "Must provide .mp3 file" }});
      noErrors = false;
    }
    if (!fileState.artworkFile.acceptedFile) {
      dispatch({ type: "SET_ERROR", payload: { dropzone: "artworkFile", error: "Must provide artwork" }});
      noErrors = false;
    }
    if (licenses.premium.selected && !fileState.wavFile.acceptedFile || licenses.exclusive.selected && !fileState.wavFile.acceptedFile) {
      dispatch({ type: "SET_ERROR", payload: { dropzone: "wavFile", error: "Must provide .wav file" }});
      noErrors = false;
    }
    return noErrors;
  }

  const appendFilesToFormData = (formData: TBeatUploadSchema) => {
    const filesFormData = new FormData();

    if (fileState.artworkFile.acceptedFile) filesFormData.append('artworkFile', fileState.artworkFile.acceptedFile);
    if (fileState.mp3File.acceptedFile) filesFormData.append('mp3File', fileState.mp3File.acceptedFile);
    if (fileState.wavFile.acceptedFile) {
      const { licenses } = formData;
      if (licenses.premium.selected || licenses.exclusive.selected) filesFormData.append('wavFile', fileState.wavFile.acceptedFile);
    }
    return filesFormData;
  }
  
  const handleDraft = async () => {
    setIsDraftLoading(true);
    const currentFormValues = getValues();
    const filesFormData = appendFilesToFormData(currentFormValues);

    const res = await addBeat(currentFormValues, filesFormData, slug, "draft");
    res?.success ? toast.success("Successfully drafted") : toast.error("Something went wrong");
    setIsDraftLoading(false);
  }

  const handlePublish = async (formData: TBeatUploadSchema) => {
    if (verifyFilesAreSubmitted(formData)) {
      setIsPublishLoading(true);
      const filesFormData = appendFilesToFormData(formData);

      const res = await addBeat(formData, filesFormData, slug, "published");
      res?.success ? toast.success("Successfully published") : toast.error("Something went wrong");
      setIsPublishLoading(false);
    } else {
      toast.error("Attach required files");
    }
  }


  const artWorkDropZoneStyles = `${fileState.artworkFile.acceptedFile ? '' : 'border-dashed'} flex items-center p-5 text-center justify-center bg-neutral-850 w-full aspect-square rounded border-2 border-neutral-700 relative`;
  const audioFilesDropZoneStyles = `${fileState.mp3File.acceptedFile ? '' : 'border-dashed'} flex items-center px-5 py-3 text-center justify-center bg-neutral-850 w-full min-h-[100px] rounded border-2 border-neutral-700 relative`;

  return (
    <form className="flex flex-col gap-14 px-4 max-w-[325px] lg:max-w-none lg:grid lg:grid-rows-2 lg:grid-cols-3 ">
      <div className="flex flex-col gap-5 lg:col-start-3 lg:row-span-3 lg:w-[325px]">
        <h2 className="text-2xl">Assets</h2>
        <div>
          <div className="flex mb-2 items-center gap-2">
            <h2 >Artwork *</h2>
            <InfoIcon dialogueText="Used for display purposes. Supported formats: .png, .jpg, .jpeg" />
          </div>
          <DragDropArea 
            filesState={fileState.artworkFile} 
            dispatch={dispatch} 
            styles={artWorkDropZoneStyles} 
            dropZoneName={"artworkFile"}
            dropZoneOptions={{
              accept: {
                'image/png': ['.png', '.jpeg', '.jpg'],
              },
              maxSize: 3 * 1024 * 1024,
              minSize: 200 * 200,
            }}
          />
          {fileState.artworkFile.errorMsg && <p className="text-red-400 text-sm">{`${fileState.artworkFile.errorMsg}`}</p>}
        </div>
        <div>
          <p className="mb-2">MP3</p>
          <DragDropArea 
            filesState={fileState.mp3File} 
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
          {fileState.mp3File.errorMsg && <p className="text-red-400 text-sm">{`${fileState.mp3File.errorMsg}`}</p>}
        </div>
        <div>
          <p className="mb-2">WAV</p>
          <DragDropArea 
            filesState={fileState.wavFile} 
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
          {fileState.wavFile.errorMsg && <p className="text-red-400 text-sm">{`${fileState.wavFile.errorMsg}`}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-5 md:row-start-1 lg:row-start-1 lg:col-span-2 lg:row-span-2 lg:max-w-[650px]">
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl">Details</h2>
          <div className="default-field-container">
            <label className="mb-2" htmlFor="title">Title *</label>
            <input className="dark-input-field" type="text" id="title" {...register("title")}/>
            {errors.title && <p className="text-red-400 text-sm">{`${errors.title.message}`}</p>}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p>License(s) *</p>
              <InfoIcon dialogueText="Select the license(s) associated with this beat. Default pricing can be changed in your system preferences" />
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-6">
              <button onClick={() => manageLicenseSelection("basic")} type="button" className={`bg-neutral-850 rounded border border-neutral-700 px-2 py-1 flex flex-col gap-1 cursor-pointer hover:bg-neutral-800 hover:border-neutral-600 ${watchLicenses.basic.selected && `bg-transparent-orange border-orange-500 hover:bg-transparent-orange-hv hover:border-orange-400`}`}>
                <p>Basic License</p>
                <p className={`text-orange-500 font-semibold ${watchLicenses.basic.selected && `text-orange-300`}`}>€ {watchLicenses.basic.price}</p>
                <p className="text-sm text-neutral-400 font-light">.mp3 format</p>
              </button>
              <button onClick={() => manageLicenseSelection("premium")} type="button" className={`bg-neutral-850 rounded border border-neutral-700 px-2 py-1 flex flex-col gap-1 cursor-pointer hover:bg-neutral-800 hover:border-neutral-600 ${watchLicenses.premium.selected && `bg-transparent-orange border-orange-500 hover:bg-transparent-orange-hv hover:border-orange-400`}`}>
                <p>Premium License</p>
                <p className={`text-orange-500 font-semibold ${watchLicenses.premium.selected && `text-orange-300`}`}>€ {watchLicenses.premium.price}</p>
                <p className="text-sm text-neutral-400 font-light">.mp3 / .wav format</p>
              </button>
              <button onClick={() => manageLicenseSelection("exclusive")} type="button" className={`bg-neutral-850 rounded border border-neutral-700 px-2 py-1 flex flex-col gap-1 cursor-pointer hover:bg-neutral-800 hover:border-neutral-600 ${watchLicenses.exclusive.selected && `bg-transparent-orange border-orange-500 hover:bg-transparent-orange-hv hover:border-orange-400`}`}>
                <p>Exclusive License</p>
                <p className={`text-orange-500 font-semibold ${watchLicenses.exclusive.selected && `text-orange-300`}`}>€ {watchLicenses.exclusive.price}</p>
                <p className="text-sm text-neutral-400 font-light">.mp3 / .wav format</p>
              </button>
            </div>
            {errors.licenses && <p className="text-red-400 text-sm">{`${errors.licenses.message}`}</p>}
          </div>
          <div className="flex flex-col gap-5">
            { watchLicenses.basic.selected &&
              <div className="default-field-container">
                <label className="mb-2" htmlFor="basicPrice">Basic Price</label>
                <div className="dark-input-field flex items-center gap-1">
                  €<input className="bg-transparent outline-none w-full" type="number" id="basicPrice" {...register("licenses.basic.price", {
                    setValueAs: value => value === '' ? 0 : parseFloat(value),
                    min: { value: 0, message: "Price must be positive" },
                  })}/>
                </div>
              </div>
            }
            { watchLicenses.premium.selected &&
              <div className="default-field-container">
                <label className="mb-2" htmlFor="title">Premium Price</label>
                <div className="dark-input-field flex items-center gap-1">
                  €<input className="bg-transparent outline-none w-full" type="number" id="basicPrice" {...register("licenses.premium.price", {
                    setValueAs: value => value === '' ? 0 : parseFloat(value),
                    min: { value: 0, message: "Price must be positive" },
                  })}/>
                </div>
              </div>
            }
            { watchLicenses.exclusive.selected &&
              <div className="default-field-container">
                <label className="mb-2" htmlFor="title">Exclusive Price</label>
                <div className="dark-input-field flex items-center gap-1">
                  €<input className="bg-transparent outline-none w-full" type="number" id="basicPrice" {...register("licenses.exclusive.price", {
                    setValueAs: value => value === '' ? 0 : parseFloat(value),
                    min: { value: 0, message: "Price must be positive" },
                  })}/>
                </div>
              </div>
            }
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:mt-10">
          <div className="flex mb-4 items-center gap-2">
            <h2 className="text-2xl">Metadata</h2>
            <InfoIcon dialogueText="Helps improve beat discoverability in searches" />
          </div>
          <div className="grid grid-cols-2 gap-2 lg:gap-6">
            <div className="default-field-container">
              <label className="mb-2" htmlFor="bpm">Bpm</label>
              <input className="dark-input-field" type="number" id="bpm" {...register("bpm")} />
            </div>
            <div className="default-field-container">
              <label className="mb-2" htmlFor="key">Key</label>
              <select id="key" className="dark-input-field" {...register("key")}>
                <option value={undefined}></option>
                <option value="a-flat minor">A-flat minor</option>
                <option value="a-flat major">A-flat major</option>
                <option value="a minor">A minor</option>
                <option value="a major">A major</option>
                <option value="a-sharp minor">A-sharp minor</option>
                <option value="a-sharp major">A-sharp major</option>
                <option value="b-flat minor">B-flat minor</option>
                <option value="b-flat major">B-flat major</option>
                <option value="b minor">B minor</option>
                <option value="b major">B major</option>
                <option value="c flat major">C-flat major</option>
                <option value="c minor">C minor</option>
                <option value="c major">C major</option>
                <option value="c-sharp minor">C-sharp minor</option>
                <option value="c-sharp major">C-sharp major</option>
                <option value="d-flat major">D-flat major</option>
                <option value="d minor">D minor</option>
                <option value="d major">D major</option>
                <option value="d-sharp minor">D-sharp minor</option>
                <option value="e-flat minor">E-flat minor</option>
                <option value="e-flat major">E-flat major</option>
                <option value="e minor">E minor</option>
                <option value="e major">E major</option>
                <option value="f minor">F minor</option>
                <option value="f major">F major</option>
                <option value="f-sharp minor">F-sharp minor</option>
                <option value="f-sharp major">F-sharp major</option>
                <option value="g-flat major">G-flat major</option>
                <option value="g minor">G minor</option>
                <option value="g major">G major</option>
                <option value="g-sharp minor">G-sharp minor</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:gap-6">
            <div className="default-field-container">
              <label className="mb-2" htmlFor="genre">Genre</label>
              <select id="genre" className="dark-input-field" {...register("genre")}>
                <option value={undefined}></option>
                <option value="drill">Drill</option>
                <option value="electronic">Electronic</option>
                <option value="hip hop">Hip Hop</option>
                <option value="lo-fi">Lo-fi</option>
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="r&b">R&B</option>
              </select>
            </div>
            <div className="default-field-container">
              <label className="mb-2" htmlFor="mood">Mood</label>
              <select id="mood" className="dark-input-field" {...register("mood")}>
                <option value={undefined}></option>
                <option value="bouncy">Bouncy</option>
                <option value="dark">Dark</option>
                <option value="energetic">Energetic</option>
                <option value="exciting">Exciting</option>
                <option value="happy">Happy</option>
                <option value="lonely">Lonely</option>
                <option value="romantic">Romantic</option>
                <option value="sad">Sad</option>
                <option value="uplifting">Uplifting</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:col-start-3">
        <button onClick={() => handleDraft()} disabled={isDraftLoading || isPublishLoading} type="button" className={`bg-white text-neutral-600 w-full rounded h-10 font-semibold hover:bg-neutral-300 ${isDraftLoading && `italic`}`}>{isDraftLoading ? "Saving..." : "Save as Draft"}</button>
        <button onClick={handleSubmit(handlePublish)} disabled={isDraftLoading || isPublishLoading} type="submit" className={`bg-orange-500 text-orange-100 w-full rounded h-10 font-semibold hover:bg-orange-400 ${isPublishLoading && `italic`}`}>{isPublishLoading ? "Publishing..." : "Publish"}</button>
      </div>
    </form>
  )
}