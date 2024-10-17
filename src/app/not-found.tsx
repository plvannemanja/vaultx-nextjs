'use client';
import NotFoundComponent from '@/components/sections/not-found';
import NotFoundAll from '@/components/sections/not-found-all';
import { usePathname } from 'next/navigation';
import SideBar from './components/ui/SideBar';

const NotFoundPage = (props) => {
  const pathName = usePathname();
  console.log('pathName', pathName);

  const isDashboard = pathName?.includes('/dashboard');

  return (
    <div className="">
      {isDashboard && (
        <section className="flex gap-x-2 relative">
          <div className="hidden lg:block xl:w-[310px] shrink-0">
            <SideBar />
          </div>
          <NotFoundComponent />
        </section>
      )}
      {!isDashboard && <NotFoundAll />}
    </div>
  );
};

export default NotFoundPage;
