'use client';

import React from 'react';
import SideBar from '../components/ui/SideBar';
import AppHeader from '../components/Header/AppHeader';
import { Toaster } from '@/components/ui/toaster';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex gap-x-2">
      <div className="hidden lg:block w-[17rem]">
        <SideBar />
      </div>
      <div className="w-full lg:w-[100%] flex flex-col gap-y-2 px-[20px]">
        <AppHeader />
        {children}
        <Toaster />
      </div>
    </section>
  );
}
