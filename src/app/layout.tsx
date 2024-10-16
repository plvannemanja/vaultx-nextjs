import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Azeret_Mono, Manrope } from 'next/font/google';
import { ThirdwebProvider } from 'thirdweb/react';
import { GlobalProvider } from './components/Context/GlobalContext';
import { ThemeProvider } from './components/theme-provider';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'] });
export const AzeretMono = Azeret_Mono({
  subsets: ['latin'],
  variable: '--azeret-mono',
});

export const metadata: Metadata = {
  title: 'Vault',
  description: 'Monstorx frontend real world NFT marketplace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.className} ${AzeretMono.className} font-manrope`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ThirdwebProvider>
            <GlobalProvider>
              {children}
              <Toaster />
            </GlobalProvider>
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
