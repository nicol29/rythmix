import LogOutButton from '@/components/logOutButton'
import Header from '@/components/header'


export default async function Home() {

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <LogOutButton />
      </main>
    </>
  )
}
