'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Topbar() {
  const pathname = usePathname();
  const title = pathname?.split('/')[1]?.charAt(0).toUpperCase() + pathname?.split('/')[1]?.slice(1);

  return (
    <header className="w-full h-16 border-b flex items-center justify-between px-6 bg-white sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-gray-800 tracking-tight">{title || 'Dashboard'}</h2>

      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback>SB</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Sushanta</p>
          <p className="text-xs text-gray-500">Logged in</p>
        </div>
      </div>
    </header>
  );
}
