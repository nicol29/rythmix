import { SearchIcon } from "@/assets/icons";
import { useEffect, useState, useRef } from "react";
import { getSearchResults } from "@/server-actions/getSearchResults";
import { BeatDocumentInterface } from "@/types/mongoDocTypes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useDetectOutsideClick from "@/hooks/useDetectOutsideClick";


export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BeatDocumentInterface[]>([]);
  const [isSearchDropDownActive, setIsSearchDropDownActive] = useState(false);
  
  const router = useRouter();

  const searchDropDownRef = useRef<HTMLFormElement>(null);

  useDetectOutsideClick([searchDropDownRef], () => setIsSearchDropDownActive(false));

  useEffect(() => {
    (async() => {
      if (searchQuery.length < 1) {
        setSearchResults([]);
        return;
      }
      
      const res = await getSearchResults(searchQuery);
      setIsSearchDropDownActive(true);

      if (res.success) setSearchResults(res.beats);
    })()
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setSearchResults([]);

    router.push(`/search?searchString=${searchQuery}`);
  }

  return (
    <form 
      ref={searchDropDownRef} 
      onSubmit={(e) => handleSubmit(e)} 
      className={`relative w-4/5 bg-neutral-750 h-9 border border-neutral-600 flex items-center justify-between px-3 sm:w-[300px] md:w-[400px] ${searchResults.length > 0 && isSearchDropDownActive ? "rounded-tl-[18px] rounded-tr-[18px]" : "rounded-full"}`}
    >
      <input onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} type="text" placeholder="Search" className="bg-transparent outline-none w-5/6"/>
      <button aria-label="Search">
        <SearchIcon className="text-neutral-400 h-6 cursor-pointer" />
      </button>
      { (searchResults.length > 0 && isSearchDropDownActive) && 
        <div className="absolute w-full bg-neutral-750 top-[38px] left-0 border border-neutral-600 max-h-[330px] overflow-y-auto rounded-bl rounded-br">
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