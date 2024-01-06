import LogOutButton from '@/components/logOutButton'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from './api/auth/[...nextauth]/route';


export default async function Home() {
  const session = await getServerSession();
  // if (!session?.user) redirect("/login");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LogOutButton />
    </main>
  )
}
