'use client';

import React from 'react';
import AppHeader from '../components/Header/AppHeader';
import SideBar from '../components/ui/SideBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex gap-x-2">
      <div className="hidden lg:block xl:w-[310px] shrink-0">
        <SideBar />
      </div>
      <div className="w-full lg:w-[100%] flex flex-col gap-y-2 px-2">
        <AppHeader />
        {children}
      </div>
    </section>
  );
}
