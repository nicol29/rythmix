import CheckOutSection from "./checkoutSection"


export default async function ProfileSettings() {
  return (
    <main className="min-h-screen pt-14">
      <section className="relative bg-neutral-925 drop-shadow flex justify-center items-center py-10 lg:py-0 lg:h-[200px]">
        <div className="w-5/6 lg:full">
          <h1 className="text-3xl">Cart</h1>
        </div>
      </section>
      <CheckOutSection />
    </main>
  )
}