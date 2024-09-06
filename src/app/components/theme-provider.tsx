'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { AutoConnect } from 'thirdweb/react';
import { client, wallets } from '@/lib/client';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function WalletAutoConnect() {
  return <AutoConnect wallets={wallets} client={client} timeout={10000} />;
}
