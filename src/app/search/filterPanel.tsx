"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { ExpandIcon, CloseIcon } from "@/assets/icons";


export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bpmFromUrl = searchParams.get("bpm");

  const [genre, setGenre] = useState<string | null>(searchParams.get("genre"));
  const [mood, setMood] = useState<string | null>(searchParams.get("mood"));
  const [key, setKey] = useState<string | null>(searchParams.get("key"));
  const [bpm, setBpm] = useState<number>(bpmFromUrl ? parseInt(bpmFromUrl) : 0);
  const [sortBy, setSortBy] = useState<string | null>(searchParams.get("sortBy"));
  const [hideForm, setHideForm] = useState<boolean>(true);


  const addQueryStringToUrl = useCallback((name: string, action: "add" | "remove", value?: string,) => {
      const params = new URLSearchParams(searchParams.toString());

      if (action === "add" && value) {
        params.set(name, value);
      } else if (action === "remove") {
        params.delete(name);
      }
 
      return params.toString();
    },[searchParams])

  const addFilterToUrl = (setState: any, inputValue: string | number, filterName: string) => {
    setState(inputValue);

    router.push(`/search/?${addQueryStringToUrl(filterName, "add", inputValue.toString())}`, { scroll: false });
  }

  const removeFilterFromUrl = (setState: any, inputValue: null | number, filterName: string) => {
    setState(inputValue);

    router.push(`/search/?${addQueryStringToUrl(filterName, "remove")}`, { scroll: false });
  }
  
  return (
    <>
      <form action="" className={`bg-neutral-900 p-4 flex flex-col rounded border border-neutral-800 ${!hideForm && `gap-7`}`}>
        <div onClick={() => setHideForm(!hideForm)} className="flex justify-between items-center cursor-pointer lg:hidden">
          <h2 className="text-lg">Filters</h2>
          <ExpandIcon className={`h-6 w-6 transition-all ${!hideForm && `rotate-180`}`} />
        </div>
        <div className={`flex flex-col gap-5 transition-all ${hideForm ? `max-h-0 overflow-hidden lg:max-h-[450px] lg:overflow-auto` : `max-h-[450px] overflow-auto`} lg:flex-row lg:gap-8`}>
          <div className="default-field-container lg:w-[150px]">
            <label className="mb-2" htmlFor="genre">Genre</label>
            <select id="genre" className="dark-input-field" value={genre || ""} onChange={(e) => addFilterToUrl(setGenre, e.target.value, e.target.id) }>
              <option value="">Select Genre</option>
              <option value="Drill">Drill</option>
              <option value="Electronic">Electronic</option>
              <option value="Hip hop">Hip Hop</option>
              <option value="Lo-fi">Lo-fi</option>
              <option value="Pop">Pop</option>
              <option value="Rock">Rock</option>
              <option value="R&B">R&B</option>
            </select>
          </div>
          <div className="default-field-container lg:w-[150px]">
            <label className="mb-2" htmlFor="mood">Mood</label>
            <select id="mood" className="dark-input-field" value={mood || ""} onChange={(e) => addFilterToUrl(setMood, e.target.value, e.target.id) }>
              <option value="">Select Mood</option>
              <option value="Bouncy">Bouncy</option>
              <option value="Dark">Dark</option>
              <option value="Energetic">Energetic</option>
              <option value="Exciting">Exciting</option>
              <option value="Happy">Happy</option>
              <option value="Lonely">Lonely</option>
              <option value="Romantic">Romantic</option>
              <option value="Sad">Sad</option>
              <option value="Uplifting">Uplifting</option>
            </select>
          </div>
          <div className="default-field-container lg:w-[150px]">
            <label className="mb-2" htmlFor="key">Key</label>
            <select id="key" className="dark-input-field" value={key || ""} onChange={(e) => addFilterToUrl(setKey, e.target.value, e.target.id) }>
              <option value="">Select Key</option>
              <option value="A-flat minor">A-flat minor</option>
              <option value="A-flat major">A-flat major</option>
              <option value="A minor">A minor</option>
              <option value="A major">A major</option>
              <option value="A-sharp minor">A-sharp minor</option>
              <option value="A-sharp major">A-sharp major</option>
              <option value="B-flat minor">B-flat minor</option>
              <option value="B-flat major">B-flat major</option>
              <option value="B minor">B minor</option>
              <option value="B major">B major</option>
              <option value="C flat major">C-flat major</option>
              <option value="C minor">C minor</option>
              <option value="C major">C major</option>
              <option value="C-sharp minor">C-sharp minor</option>
              <option value="C-sharp major">C-sharp major</option>
              <option value="D-flat major">D-flat major</option>
              <option value="D minor">D minor</option>
              <option value="D major">D major</option>
              <option value="D-sharp minor">D-sharp minor</option>
              <option value="E-flat minor">E-flat minor</option>
              <option value="E-flat major">E-flat major</option>
              <option value="E minor">E minor</option>
              <option value="E major">E major</option>
              <option value="F minor">F minor</option>
              <option value="F major">F major</option>
              <option value="F-sharp minor">F-sharp minor</option>
              <option value="F-sharp major">F-sharp major</option>
              <option value="G-flat major">G-flat major</option>
              <option value="G minor">G minor</option>
              <option value="G major">G major</option>
              <option value="G-sharp minor">G-sharp minor</option>
            </select>
          </div>
          <div className="default-field-container lg:w-[150px]">
            <label className="mb-2" htmlFor="sortBy">Bpm</label>
            <div className="flex items-center gap-3">
              <span>0</span>
              <input 
                id="bpm"
                className="h-2 cursor-pointer flex-grow" 
                type="range" 
                min="0" 
                max="1000" 
                step="1" 
                value={bpm} 
                onChange={(e) => setBpm(parseInt(e.target.value))} 
                onMouseUp={() => addFilterToUrl(setBpm, bpm, "bpm")}
                onTouchEnd={() => addFilterToUrl(setBpm, bpm, "bpm")}
              />
              <span>{bpm}</span>
            </div>
          </div>
          <div className="default-field-container lg:w-[150px]">
            <label className="mb-2" htmlFor="sortBy">Sort By</label>
            <select id="sortBy" className="dark-input-field" value={sortBy || ""} onChange={(e) => addFilterToUrl(setSortBy, e.target.value, e.target.id) }>
              <option value={""}>Select Sort</option>
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>
      </form>
      <div className="mt-6">
        <span>Active Filters</span>
        <div className="flex flex-wrap gap-2 mt-2">
          { genre && 
            <div className="bg-neutral-850 flex items-center gap-2 rounded-full px-2 w-fit text-sm">{genre}<CloseIcon onClick={() => removeFilterFromUrl(setGenre, null, "genre")} className="h-3 w-3 cursor-pointer" /></div>}
          { mood && 
            <div className="bg-neutral-850 flex items-center gap-2 rounded-full px-2 w-fit text-sm">{mood}<CloseIcon onClick={() => removeFilterFromUrl(setMood, null, "mood")} className="h-3 w-3 cursor-pointer" /></div>}
          { key && 
            <div className="bg-neutral-850 flex items-center gap-2 rounded-full px-2 w-fit text-sm">{key}<CloseIcon onClick={() => removeFilterFromUrl(setKey, null, "key")} className="h-3 w-3 cursor-pointer" /></div>}
          { bpm !== 0 && 
            <div className="bg-neutral-850 flex items-center gap-2 rounded-full px-2 w-fit text-sm">{`${bpm} bpm`}<CloseIcon onClick={() => removeFilterFromUrl(setBpm, 0, "bpm")} className="h-3 w-3 cursor-pointer" /></div>}
          { sortBy && 
            <div className="bg-neutral-850 flex items-center gap-2 rounded-full px-2 w-fit text-sm">{sortBy}<CloseIcon onClick={() => removeFilterFromUrl(setSortBy, null, "sortBy")} className="h-3 w-3 cursor-pointer" /></div>}
        </div>
      </div>
    </>
  )
}
