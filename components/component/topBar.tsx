'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { LandmarkIcon } from './dashboard';
import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUserFromToken, removeToken } from '../../services/auth';
import { SlArrowUp, SlArrowDown } from 'react-icons/sl';

function TopBar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    removeToken();
    setUser(null);
    router.push('/auth/login');
  }, [router]);

  const toggleMenu = (open: boolean | ((prevState: boolean) => boolean)) => {
    setMenuOpen(open);
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 md:h-[60px] md:px-6">
      <Link href="#" className="lg:hidden" prefetch={false}>
        <LandmarkIcon className="h-6 w-6" />
        <span className="sr-only">Home</span>
      </Link>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="w-full bg-background shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <DropdownMenu onOpenChange={toggleMenu}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8 relative">
            <Image
              src="/placeholder.svg"
              width="32"
              height="32"
              className="rounded-full"
              alt="Avatar"
              style={{ aspectRatio: '32/32', objectFit: 'cover' }}
            />
            <span className="sr-only">Toggle user menu</span>
            <div className="absolute top-1/2 bottom-0 transform -translate-y-1/2">
              {menuOpen ? <SlArrowUp /> : <SlArrowDown />}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><Link href='/settings'>Settings</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default TopBar;
