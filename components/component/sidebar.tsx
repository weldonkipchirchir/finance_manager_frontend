"use client";
import { MdMoney } from "react-icons/md"
import { DoorClosedIcon, DoorOpenIcon, GoalIcon } from "lucide-react"
import Link from "next/link"
import { JSX, SVGProps, useState } from "react"
import { Button } from "@/components/ui/button"
import { LandmarkIcon, WalletIcon } from "./dashboard"

export function Sidebar() {
    const [open, setOpen] = useState(true);

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    return (
        <div className={`border-r bg-muted/40 ${open ? 'w-64' : 'w-20'} transition-width duration-300`}>
            <div className="flex h-full flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                    <Link href="#" className="flex items-center gap-2 font-semibold" prefetch={false}>
                        {open && <LandmarkIcon className="h-6 w-6" />}
                        {open && <span>Finance Manager</span>}
                    </Link>
                    <Button variant="outline" size="icon" className="ml-auto h-8 w-8" onClick={handleToggle}>
                        {open ? (
                            <DoorOpenIcon className="h-4 w-4" />
                        ) : (
                            <DoorClosedIcon className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                <div className={`flex-1 overflow-auto py-2 ${open ? 'block' : 'hidden'}`}>
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                            prefetch={false}
                        >
                            <HomeIcon className="h-4 w-4" />
                            {open && "Dashboard"}
                        </Link>
                        <Link
                            href="/budget"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            prefetch={false}
                        >
                            <WalletIcon className="h-4 w-4" />
                            {open && "Budgets"}
                        </Link>
                        <Link
                            href="/transaction"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            prefetch={false}
                        >
                            <CreditCardIcon className="h-4 w-4" />
                            {open && "Transactions"}
                        </Link>
                        <Link
                            href="/income"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            prefetch={false}
                        >
                            <MdMoney className="h-4 w-4" />
                            {open && "Income"}
                        </Link>
                        <Link
                            href="/goal"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            prefetch={false}
                        >
                            <GoalIcon className="h-4 w-4" />
                            {open && "Goals"}
                        </Link>
                        <Link
                            href="/settings"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            prefetch={false}
                        >
                            <SettingsIcon className="h-4 w-4" />
                            {open && "Settings"}
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}
function HomeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}

function CreditCardIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
    )
}

function SettingsIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}
