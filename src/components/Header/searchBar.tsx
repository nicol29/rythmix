import { SearchIcon } from "@/assets/icons";
import { useEffect, useState } from "react";
import { getSearchResults } from "@/server-actions/getSearchResults";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";
import Image from "next/image";
import Link from "next/link";


export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BeatDocumentInterface[]>([]);


  useEffect(() => {
    (async() => {
      if (searchQuery.length < 1) return;

      const res = await getSearchResults(searchQuery);

      if (res.success) setSearchResults(res.beats);
    })()
  }, [searchQuery]);

  return (
    <form className={`relative w-4/5 bg-neutral-750 h-9 border border-neutral-600 flex items-center justify-between px-3 sm:w-[300px] md:w-[400px] ${searchResults.length > 0 ? "rounded-tl-[10px] rounded-tr-[10px]" : "rounded-[30px]"}`}>
      <input onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} type="text" placeholder="Search" className="bg-transparent outline-none w-5/6"/>
      <button>
        <SearchIcon className="text-neutral-400 h-6 cursor-pointer" />
      </button>
      { searchResults.length > 0 &&
        <div className="absolute w-full bg-neutral-750 top-9 left-0 border border-neutral-600 max-h-[330px] overflow-y-auto rounded-bl-[20px] rounded-br-[20px]">
          { searchResults.map(result => (
              <Link href={`/beat/${result.urlIdentifier}`} key={result._id.toString()}>
                <div className="py-2 px-4 flex gap-2 hover:bg-neutral-600">
                  <div className="relative w-[40px] aspect-square shrink-0 self-center">
                    <Image className="rounded" src={result.assets.artwork.url} fill objectFit="cover" quality={20} sizes="w-full h-full" alt="Beat artwork" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="max-w-full truncate">{result.title}</span>
                    <span className="text-neutral-200 text-sm font-light">{result.producer.userName}</span>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      }
    </form>
  )
}