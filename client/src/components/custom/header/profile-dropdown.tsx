'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, User, SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function ProfileDropdown() {
  const router = useRouter();
  const [user] = useState(() => {
    // Fetch user from localStorage or API context/state if you have it
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : { first_name: 'L', last_name: 'S' };
  });

  const initials = `${user.first_name[0]}${user.last_name[0]}`;

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' }); // or your real logout endpoint
      localStorage.clear();
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-primary text-white hover:bg-primary/90 cursor-pointer"
        >
          <span className="font-semibold">{initials}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/preferences')}>
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Preferences
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-red-500">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
