export default function Loading() {
  return (
    <ul className="w-5/6 flex flex-col gap-2 sm:max-w-[1200px]">
      <div className="h-16 bg-neutral-800 rounded-md animate-pulse"></div>
      <div className="h-16 bg-neutral-800 rounded-md animate-pulse"></div>
      <div className="h-16 bg-neutral-800 rounded-md animate-pulse"></div>
      <div className="h-16 bg-neutral-800 rounded-md animate-pulse"></div>
      <div className="h-16 bg-neutral-800 rounded-md animate-pulse"></div>
      <div className="h-16 bg-neutral-800 rounded-md animate-pulse"></div>
    </ul>
  )
}