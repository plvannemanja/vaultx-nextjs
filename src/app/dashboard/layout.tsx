'use client';

import React from 'react';
import SideBar from '../components/ui/SideBar';
import AppHeader from '../components/Header/AppHeader';

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
      <div className="w-full lg:w-[80%] flex flex-col gap-y-2">
        <AppHeader />
        {children}
      </div>
    </section>
  );
}
