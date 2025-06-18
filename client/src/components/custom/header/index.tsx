"use client";

import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useProfileStore } from "@/hooks/zustand/users/userProfile";
import { ProfileDropdown } from "./profile-dropdown";
import { RoleDropdown } from "./roled-dropdown";
// import { NotificationBanner } from "./NotificationBanner";

interface HeaderProps {
    isOnline: boolean;
    children?: React.ReactNode;
}

export function Header({ isOnline, children }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { role } = useParams<{ role: string }>();
    const { data: userProfile } = useProfileStore();
    const [showBackOnline, setShowBackOnline] = useState(false);
    const prevOnlineState = useRef(isOnline);

    const isHome = pathname === `/${role}`;

    useEffect(() => {
        if (isOnline && !prevOnlineState.current) {
            setShowBackOnline(true);
            setTimeout(() => {
                setShowBackOnline(false);
            }, 3000);
        }

        prevOnlineState.current = isOnline;
    }, [isOnline]);

    return (
        <div className="w-full fixed z-40 top-0 print:hidden">
            <div className="">
                {/* <NotificationBanner /> */}
            </div>

            <header className="w-full px-4 md:px-8 pr-6 md:pr-12 border-b bg-white flex h-14 items-center justify-between">
                {children}
            </header>
        </div>
    );
}
