import FilterPanel from "./filterPanel";
import { getSearchResults } from "@/server-actions/getSearchResults";
import BeatResultCards from "./beatResultCards";
import { Metadata } from 'next';
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";

export const metadata: Metadata = {
  title: "Search | Rythmix",
}

export default async function Search({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | undefined }
}) {

  const bpmToInt = searchParams.bpm ? parseInt(searchParams.bpm) : undefined;
  let sortFilter;

  if (searchParams.sortBy) {
    sortFilter = searchParams.sortBy === "Newest" ? -1 : 1;
  }

  const filters = {
    ...(searchParams.genre ? { genre: searchParams.genre } : {}),
    ...(searchParams.mood ? { mood: searchParams.mood } : {}),
    ...(searchParams.key ? { key: searchParams.key } : {}),
    ...(bpmToInt ? { bpm: bpmToInt } : {}),
  }

  let beats;
  if (searchParams.searchString) beats = await getSearchResults(searchParams.searchString, filters, sortFilter);
  
  return (
    <>
      <Header />
      <main className="mt-14 min-h-screen">
        <section className="relative bg-neutral-925 flex justify-center py-10 lg:py-0 lg:h-[250px]">
          <div className="w-5/6 max-w-[400px] lg:w-fit lg:max-w-none lg:absolute lg:top-[150px]">
            <h1 className="text-2xl mb-4">{`Search results for "${searchParams.searchString}"`}</h1>
            <FilterPanel />
          </div>
        </section>
        <section className="flex justify-center py-12 lg:mt-[100px]">
          <BeatResultCards 
            beats={beats?.beats}
            searchString={searchParams.searchString}
            filters={filters}
            sortFilter={sortFilter}
          />
        </section>
      </main>
      <Footer />
    </>
  )
}