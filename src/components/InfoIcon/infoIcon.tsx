export default function InfoIcon({ dialogueText }: { dialogueText: string }) {
  return (
    <div className="group flex justify-center items-center bg-neutral-300 text-neutral-600 h-4 w-4 rounded-full font-medium cursor-pointer relative">
    i
      <div className="hidden group-hover:block absolute min-w-[140px] bg-neutral-300 border border-neutral-600 rounded bottom-0 left-full ml-1 p-1">
        <p className="text-sm font-normal leading-4">{dialogueText}</p>
      </div>
    </div>
  )
}