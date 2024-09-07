'use client';
import { JSX, SVGProps, useEffect, useState } from 'react';
import Link from "next/link";
import { useUser } from '@/context/auth';
import { UserProfile } from '@/interfaces/interfaces';

export function Navbar() {
  const {user}= useUser();
  const [userDetails, setUserDetails] = useState<UserProfile>()

  useEffect(() => {
    function setAuser() {
      if (user) {
        setUserDetails(user as UserProfile);
      } else {
        setUserDetails(undefined);
      }
    }
    setAuser();
  }, [user]);

  return (
    <div>
      <header className="bg-primary text-primary-foreground px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <MountainIcon className="size-6" />
          <span className="font-bold text-lg">Finance Manager</span>
        </Link>
        <p className="ml-4 text-sm font-medium">Manage Your Finances Effortlessly</p>
        <div className="ml-auto flex gap-4 sm:gap-6">
          {userDetails ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/budget">Budgets</Link>
              <Link href="/transaction">Transactions</Link>
              <Link href="/income">Income</Link>
              <Link href="/goal">Goals</Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  )
}

function MountainIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
