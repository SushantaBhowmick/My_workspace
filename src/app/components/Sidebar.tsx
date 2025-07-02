"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  ListChecks,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/supabaseClient";
import { Button } from "@/components/ui/button";
import showToast from "@/components/showToast";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Tasks", href: "/tasks", icon: ListChecks },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast.error("Error while Logout");
    } else {
      localStorage.clear();
      sessionStorage.clear()
      showToast.success("Logout Successfully!");
      // window.location.reload();
      router.replace("/login");
    }
  };

  return (
    <aside className="w-64 bg-white border-r h-screen p-4 flex flex-col justify-between">
      <div>
        <Link href={'/'} className=" cursor-pointer">
        <h1 className="text-2xl font-bold mb-6 text-primary">My_workspae</h1>
        </Link>
        <nav className="flex flex-col gap-2">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition",
                pathname === href && "bg-gray-100 font-medium"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <Button
        className="flex cursor-pointer items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition"
        onClick={handleLogOut}
      >
        <span>Logout</span>
        <LogOut className="w-5 h-5" />
      </Button>
    </aside>
  );
}
