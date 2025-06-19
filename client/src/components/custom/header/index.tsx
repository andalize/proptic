"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useProfileStore } from "@/hooks/zustand/users/userProfile";
// import { NotificationBanner } from "./NotificationBanner";

interface HeaderProps {
  isOnline: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function Header({ isOnline, left, right }: HeaderProps) {
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
      <header className="w-full px-8 md:px-8 pr-6 md:pr-12 border-b bg-white flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">{left}</div>
        <div className="flex items-center gap-4">{right}</div>
      </header>
    </div>
  );
}