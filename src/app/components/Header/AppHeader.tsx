import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { List } from 'lucide-react';
import Menu from './Menu';
import SideBar from '../ui/SideBar';
import { useEffect, useState } from 'react';
import { getCookie } from '@/lib/cookie';
import { WalletAutoConnect } from '../theme-provider';

export default function AppHeader() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const connectedUser = JSON.parse(getCookie('user'));
    console.log('connectedUser', connectedUser);
    setUser(connectedUser);
  }, []);
  return (
    <div className="flex justify-between lg:justify-end mt-6 px-3 items-center">
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <List size={24} className="my-auto"></List>
          </SheetTrigger>
          <SheetContent side="left" className="bg-dark w-[18rem]">
            <SheetHeader className="text-left">
              <SheetDescription>
                <SideBar className="bg-transparent" />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <Menu user={user} />
      <WalletAutoConnect />
    </div>
  );
}
