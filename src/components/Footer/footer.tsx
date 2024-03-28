import Image from "next/image"


export default function Footer() {
  return (
    <footer className="min-h-[350px] w-full bg-neutral-950">
      <div className="bg-orange-500 h-6 flex items-center justify-center text-white drop-shadow-lg">
        <p className="font-light">Keep <span className="font-bold">100%</span> of profits when selling on <span className="font-bold">RYTHMIX</span></p>
      </div>
      <div className="p-10 pb-28 flex flex-col gap-12 justify-between lg:flex-row lg:gap-0 lg:p-10">
        <div className="flex flex-col">
          <Image
              src="/transparentRythmix.png"
              className="h-10 w-auto mt-1 self-start"
              alt="Rythmix Logo"
              width={1024}
              height={246}
            />
          <p className="text-neutral-500 text-xs mt-2">© 2034 - 2024 Rythmix. All rights reserved</p>
        </div>
        <div className="flex flex-col gap-8 lg:gap-[150px] lg:flex-row ">
          <div className="flex flex-col">
            <h2 className="text-lg mb-2 font-semibold">Rythmix</h2>
            <ul className="flex flex-col gap-1 text-neutral-500">
              <li>About Us</li>
              <li>Blog</li>
              <li>Terms and Conditions</li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg mb-2 font-semibold">Support</h2>
            <ul className="flex flex-col gap-1 text-neutral-500">
              <li>Pricing</li>
              <li>Contact Us</li>
              <li>Selling</li>
              <li>Cookie Preferences</li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg mb-2 font-semibold">Social</h2>
            <ul className="flex flex-col gap-1 text-neutral-500">
              <li>Instagram</li>
              <li>Youtube</li>
              <li>SoundCloud</li>
              <li>Twitter</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}