import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { ThirdwebProvider } from 'thirdweb/react';
import { ThemeProvider } from './components/theme-provider';
import { GlobalProvider } from './components/Context/GlobalContext';

const manrope = Manrope({ subsets: ['latin'] });

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
      <body className={manrope.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ThirdwebProvider>
            <GlobalProvider>{children}</GlobalProvider>
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
