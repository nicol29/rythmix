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
import ProgressBarProvider from '@/utils/progressBarProvider';


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
            <ProgressBarProvider>
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
            </ProgressBarProvider>
          </AudioPlayerContextProvider>
        </CartItemsContextProvider>
      </SessionProvider>
    </html>
  )
}
