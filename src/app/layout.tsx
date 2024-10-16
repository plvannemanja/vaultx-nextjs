import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { ThirdwebProvider } from 'thirdweb/react';
import { GlobalProvider } from './components/Context/GlobalContext';
import { ThemeProvider } from './components/theme-provider';
import './globals.css';

// const ManropeFont = localFont({
//   src: './fonts/manrope.woff2',
//   variable: '--manrope',
// });
// const AzeretMonoFont = localFont({
//   src: './fonts/AzeretMono.woff2',
//   variable: '--azeret-mono',
// });

// const manrope = Manrope({ subsets: ['latin'] });
// export const AzeretMono = Azeret_Mono({
//   subsets: ['latin'],
//   variable: '--azeret-mono',
// });

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
      <body className={`manrope-font`}>
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
