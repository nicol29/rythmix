import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/context/nextAuthSessionProvider';
import AudioPlayerContextProvider from '@/context/audioPlayerContext';
import CartItemsContextProvider from '@/context/cartItemsContext';
import { getServerSession } from 'next-auth';
import { Toaster } from 'sonner';
import PlayBar from '@/components/PlayBar/playBar';
import Footer from '@/components/Footer/footer';
import Header from '@/components/Header/header';


const sourceSans3 = Source_Sans_3({ subsets: ['latin'] })

export const metadata: Metadata = {
  
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession();
  
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <CartItemsContextProvider>
          <AudioPlayerContextProvider>
            <body className={sourceSans3.className}>
              <Header />
              {children}
              <Toaster 
                toastOptions={{
                  unstyled: true,
                  classNames: {
                    toast: 'bg-neutral-800 rounded border border-neutral-600 flex items-center justify-center gap-1 py-1 px-4',
                    title: 'text-red-800',
                    description: 'text-yellow-900',
                    actionButton: 'bg-zinc-900',
                    cancelButton: 'bg-orange-400',
                    closeButton: 'bg-lime-400',
                  },
                }}
              />
              <Footer />
              <PlayBar />
            </body>
          </AudioPlayerContextProvider>
        </CartItemsContextProvider>
      </SessionProvider>
    </html>
  )
}

// w-4/5 py-8 bg-neutral-800 rounded border border-neutral-600 flex flex-col items-center justify-center gap-10 max-w-sm
