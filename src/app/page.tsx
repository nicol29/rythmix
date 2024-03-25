import Header from '@/components/Header/header';
import Hero from '@/components/Hero/hero';
import Beats from '@/models/Beats';
import BeatCard from '@/components/BeatCard/beatCard';
import connectMongoDB from '@/config/mongoDBConnection';
import Link from 'next/link';
import Image from 'next/image';
import uniqid from "uniqid";
import Plays from '@/models/Plays';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { GenreIcon, TrendingIcon, NewReleasesIcon } from '@/assets/icons';


export default async function Home() {
  const genres = [
    { src: "/genre-images/drill.jpg", genre: "Drill" },
    { src: "/genre-images/electronic.jpg", genre: "Electronic" },
    { src: "/genre-images/hiphop.jpg", genre: "Hip hop" },
    { src: "/genre-images/lo-fi.jpg", genre: "Lo-fi" },
    { src: "/genre-images/r&b.jpg", genre: "R&B" },
    { src: "/genre-images/rock.jpg", genre: "Rock" },
  ];

  await connectMongoDB();

  const newBeats = await Beats.find({
    "status": "published",
  }).select({ 
    assets: 1,
    licenses: 1,
    bpm: 1,
    genre: 1,
    producer: 1,
    title: 1,
    urlIdentifier: 1,
  }).sort({ createdAt: -1 }).limit(10);


  dayjs.extend(utc)

  const currentDate = dayjs().utc();

  const startDate = currentDate.startOf('week').toDate();
  const endDate = currentDate.endOf('week').toDate();

  const hottestBeats = await Plays.aggregate([
    { $match: {
        time: { $lte: endDate, $gte: startDate }
      }
    },
    { $group: {
        _id: '$beat',
        plays: { $sum: 1 } 
      }
    },
    { $sort: { plays: -1 } },
    { $limit: 10 }, 
    {
      $lookup: {
        from: 'beats', 
        localField: '_id',
        foreignField: '_id',
        as: 'beatInfo'
      }
    },
    {
      $project: {
        assets: { $arrayElemAt: ['$beatInfo.assets', 0] },
        licenses: { $arrayElemAt: ['$beatInfo.licenses', 0] },
        bpm: { $arrayElemAt: ['$beatInfo.bpm', 0] },
        genre: { $arrayElemAt: ['$beatInfo.genre', 0] },
        producer: { $arrayElemAt: ['$beatInfo.producer', 0] },
        title: { $arrayElemAt: ['$beatInfo.title', 0] },
        urlIdentifier: { $arrayElemAt: ['$beatInfo.urlIdentifier', 0] },
        plays: 1
      }
    }
  ]);
  
  return (
    <>
      <Hero />
      <main className="min-h-screen flex flex-col">
        <section className="py-14 px-4 bg-neutral-850">
          <div className="max-w-[1150px] mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Welcome to <span className='text-white'>Ryth</span><span className='text-orange-500'>mix</span> - Your Ultimate Beat Store</h2>
            <p className="text-lg text-neutral-400 mb-8">Discover, purchase, and sell high-quality beats with ease. Join our community of talented producers and artists to elevate your music creation process.</p>
            <div className="flex flex-wrap justify-center gap-8 lg:flex-nowrap">
              <div className="w-full md:w-1/3 bg-neutral-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Wide Selection of Beats</h3>
                <p className="text-md text-neutral-500">Explore an extensive library of beats across various genres. Whether youre into Hip Hop, R&B, Pop, or Electronic, you will find the perfect beat to match your vibe.</p>
              </div>
              <div className="w-full md:w-1/3 bg-neutral-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Easy Licensing</h3>
                <p className="text-md text-neutral-500">Securely license beats with transparent terms. Choose from flexible licensing options to suit your project needs, from non-exclusive to exclusive rights.</p>
              </div>
              <div className="w-full md:w-1/3 bg-neutral-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Support Independent Artists</h3>
                <p className="text-md text-neutral-500">By purchasing beats from Rythmix, you are directly supporting independent producers and contributing to a thriving music community.</p>
              </div>
            </div>
          </div>
        </section>
        <section className='flex flex-col py-14 ml-6 sm:ml-12'>
          <div className='flex items-center gap-2 mb-2'>
            <h2 className='text-3xl'>Hottest Tracks</h2>
            <TrendingIcon className="h-10 w-10 text-orange-500" />
          </div>
          <div className='bg-neutral-850 p-4 rounded-bl-2xl rounded-tl-2xl flex gap-6 overflow-x-scroll sm:p-6'>
            { hottestBeats?.map(beat => (
              <BeatCard key={uniqid()} beatList={JSON.parse(JSON.stringify(hottestBeats))} beat={JSON.parse(JSON.stringify(beat))} />
            )) }
            <Link href={"/"} className='bg-neutral-700 self-center px-3 min-w-fit cursor-pointer rounded-full drop-shadow'>See more</Link>
          </div>
        </section>
        <section className='flex justify-center bg-neutral-950 py-10'>
          <div className='w-5/6 max-w-[400px]  lg:max-w-[1400px]'>
            <div className='flex items-center gap-2 mb-2'>
              <h2 className='text-3xl'>Genres</h2>
              <GenreIcon className="h-8 w-8 text-orange-500" />
            </div>
            <div className=''>
              <div className='grid grid-cols-2 grid-rows-3 gap-4 lg:grid-cols-6 lg:grid-rows-1'>
                {genres.map(item => (
                  <Link className="group relative aspect-square w-full" href={`/`} key={uniqid()}>
                    <Image className="object-cover rounded border border-neutral-750 cursor-pointer" fill sizes="w-full h-full" src={item.src} alt="Track art" />
                    <div className="absolute h-full w-full inset-0 bg-gradient-to-b from-transparent to-neutral-850 opacity-100 rounded"></div>
                    <h3 className='absolute bottom-2 left-2 text-shadow text-xl sm:transition-all sm:group-hover:-translate-y-3'>{item.genre}</h3>
                  </Link>
                ))}
              </div>
            </div>
            <div className='flex justify-end mt-4'>
              <Link href={"/"} className='bg-neutral-700 px-3 min-w-fit rounded-full drop-shadow text-sm'>See more</Link>
            </div>
          </div>
        </section>
        <section className='flex flex-col py-14 ml-6 sm:ml-12'>
          <div className='flex items-center gap-2 mb-2'>
            <h2 className='text-3xl'>Latest Tracks</h2>
            <NewReleasesIcon className="h-8 w-8 text-orange-500" />
          </div>
          <div className='bg-neutral-850 p-4 rounded-bl-2xl rounded-tl-2xl flex gap-6 overflow-x-scroll sm:p-6'>
            { newBeats?.map(beat => (
              <BeatCard key={uniqid()} beatList={JSON.parse(JSON.stringify(newBeats))} beat={JSON.parse(JSON.stringify(beat))} />
            )) }
            <Link href={"/"} className='bg-neutral-700 self-center px-3 min-w-fit cursor-pointer rounded-full drop-shadow'>See more</Link>
          </div>
        </section>
      </main>
    </>
  )
}
