import FilterPanel from "./filterPanel";


export default function Search({ searchParams }: any) {
  console.log(searchParams)

  return (
    <main className="mt-14 min-h-screen">
      <section className="bg-neutral-925 flex justify-center py-10">
        <div className="w-5/6">
          <h1 className="text-2xl mb-4">{`Search results for "${searchParams.searchString}"`}</h1>
          <FilterPanel />
        </div>
      </section>
      <section>

      </section>
    </main>
  )
}