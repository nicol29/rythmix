"use client";

import Image from "next/image";
import { useState, useEffect } from "react";


export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(currentIndex => (currentIndex + 1) % 3);
    }, 10000);

    return () => {
       clearInterval(interval);
    }
  }, []); 

  return (
    <section className="h-[450px] w-full bg-slate-500 relative sm:h-[600px] drop-shadow-lg">
      <div className="relative w-full h-full">
        <Image className={`object-cover transition-opacity duration-1000 ${activeIndex === 0 ? "opacity-100" : "opacity-0"}`} src={"/matthew-moloney-5kYKzH5Gwgk-unsplash.jpg"} priority fill alt="Group of producers" />
        <Image className={`object-cover transition-opacity duration-1000 ${activeIndex === 1 ? "opacity-100" : "opacity-0"}`} src={"/dylan-mcleod-VRdZBLqnoMU-unsplash.jpg"} priority fill alt="Producer equipment" />
        <Image className={`object-cover transition-opacity duration-1000 ${activeIndex === 2 ? "opacity-100" : "opacity-0"}`} src={"/james-owen-MuIvHRJbjA8-unsplash.jpg"} priority fill alt="Producer at work" />
        <div className="relative w-full h-full bg-gradient-to-l from-transparent to-neutral-950 opacity-100 flex items-center justify-center sm:justify-start">
          <div className="my-auto w-11/12 sm:w-4/6 sm:max-w-[600px] sm:ml-24">
            <h1 className="text-4xl font-medium text-shadow sm:mb-4 md:text-5xl">SEARCH FOR THAT NEXT <span className="text-orange-500">HIT</span></h1>
            <div className="bg-neutral-850 border border-neutral-750 rounded p-3 flex justify-between">
              <input type="text" className="bg-transparent border-b w-4/6 border-neutral-750 placeholder:text-neutral-600 outline-none" placeholder="Search tracks" />
              <button className="default-orange-button px-3 py-1 text-lg">SEARCH</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}